/**
 * lib/constants.js
 * 
 * Enterprise constants for AuraSpace to prevent magic strings and duplicate configurations.
 */

export const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' }
];

export const INITIAL_TASKS = [
  { id: 't1', title: 'Architect Database', description: 'Design Firestore schema for real-time sync.', status: 'todo', effort: 'Medium', assignee: 'AI System' },
  { id: 't2', title: 'Implement Auth', description: 'Setup Firebase Authentication.', status: 'in-progress', effort: 'High', assignee: 'Security Team' }
];

export const API_RATE_LIMIT = 5; // Max requests per minute per IP
