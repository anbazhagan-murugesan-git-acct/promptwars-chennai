/**
 * lib/gcp.js
 * 
 * Google Cloud Platform Services Integration Module.
 * Provides enterprise-grade integrations with Google BigQuery for audit logging,
 * Google Cloud Storage for file attachments, and Google Cloud Logging for observability.
 */

import { BigQuery } from '@google-cloud/bigquery';
import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud clients with project configuration
const bigquery = new BigQuery({ projectId: process.env.GOOGLE_CLOUD_PROJECT || 'auraspace-prod' });
const storage = new Storage({ projectId: process.env.GOOGLE_CLOUD_PROJECT || 'auraspace-prod' });

const DATASET_ID = 'auraspace_audit';
const TABLE_ID = 'activity_log';
const BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'auraspace-attachments';

/**
 * Pushes a structured audit log entry to Google BigQuery.
 * Used for enterprise compliance, traceability, and analytics dashboards.
 * 
 * @param {string} action - The action performed (e.g., "TASK_CREATED", "TASK_MOVED", "AI_PROMPT")
 * @param {Object} metadata - Associated data for the audit entry
 * @param {string} [metadata.userId] - The user who performed the action
 * @param {string} [metadata.taskId] - The task affected
 * @param {string} [metadata.details] - Additional context
 * @returns {Promise<Object>} The BigQuery insert response
 */
export async function pushAuditLog(action, metadata = {}) {
  const row = {
    timestamp: new Date().toISOString(),
    action,
    userId: metadata.userId || 'system',
    taskId: metadata.taskId || null,
    details: JSON.stringify(metadata.details || {}),
    source: 'auraspace-web'
  };

  try {
    await bigquery.dataset(DATASET_ID).table(TABLE_ID).insert([row]);
    console.log(`[BigQuery] Audit logged: ${action}`);
    return { success: true, timestamp: row.timestamp };
  } catch (error) {
    // Graceful degradation: log locally if BigQuery is unavailable
    console.warn(`[BigQuery] Fallback to local log: ${action}`, error.message);
    return { success: false, fallback: true, timestamp: row.timestamp };
  }
}

/**
 * Uploads a file attachment to Google Cloud Storage.
 * Supports team collaboration by allowing file sharing on task cards.
 * 
 * @param {Buffer} fileBuffer - The file content as a buffer
 * @param {string} fileName - The original file name
 * @param {string} contentType - The MIME type of the file
 * @returns {Promise<string>} The public URL of the uploaded object
 */
export async function uploadAttachment(fileBuffer, fileName, contentType) {
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const destination = `attachments/${Date.now()}-${sanitizedName}`;

  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(destination);

    await file.save(fileBuffer, {
      metadata: { contentType },
      resumable: false,
      validation: 'crc32c'
    });

    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${destination}`;
    console.log(`[Cloud Storage] Uploaded: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.warn(`[Cloud Storage] Upload failed: ${error.message}`);
    throw new Error('File upload failed. Please try again.');
  }
}

/**
 * Lists all files in a task's attachment folder from Google Cloud Storage.
 * 
 * @param {string} taskId - The task ID to list attachments for
 * @returns {Promise<Array<Object>>} Array of file metadata objects
 */
export async function listAttachments(taskId) {
  try {
    const [files] = await storage.bucket(BUCKET_NAME).getFiles({
      prefix: `attachments/${taskId}/`
    });

    return files.map(file => ({
      name: file.name,
      size: file.metadata.size,
      updated: file.metadata.updated,
      url: `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`
    }));
  } catch (error) {
    console.warn(`[Cloud Storage] List failed: ${error.message}`);
    return [];
  }
}

/**
 * Queries BigQuery for team activity analytics.
 * Powers the team coordination dashboard with real-time insights.
 * 
 * @param {string} teamId - The team identifier
 * @param {number} [days=7] - Number of days to look back
 * @returns {Promise<Array<Object>>} Array of activity summary rows
 */
export async function getTeamAnalytics(teamId, days = 7) {
  const query = `
    SELECT action, COUNT(*) as count, DATE(timestamp) as date
    FROM \`${DATASET_ID}.${TABLE_ID}\`
    WHERE userId IN (SELECT userId FROM teams WHERE teamId = @teamId)
      AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL @days DAY)
    GROUP BY action, date
    ORDER BY date DESC
  `;

  try {
    const [rows] = await bigquery.query({
      query,
      params: { teamId, days },
      location: 'asia-south1'
    });
    return rows;
  } catch (error) {
    console.warn(`[BigQuery] Analytics query failed: ${error.message}`);
    return [];
  }
}
