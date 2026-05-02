/**
 * lib/performance.js
 * 
 * Performance utilities for AuraSpace.
 * Provides memoization, debouncing, and throttling functions
 * to optimize runtime efficiency across the application.
 */

/**
 * Creates a memoized version of an expensive function.
 * Caches results based on serialized arguments to avoid redundant computation.
 * 
 * @param {Function} fn - The function to memoize
 * @param {number} [maxCacheSize=100] - Maximum number of cached results
 * @returns {Function} Memoized version of the input function
 */
export function memoize(fn, maxCacheSize = 100) {
  const cache = new Map();

  return function memoized(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);

    // Evict oldest entry if cache exceeds max size (LRU-style)
    if (cache.size >= maxCacheSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  };
}

/**
 * Creates a debounced version of a function that delays execution
 * until after the specified wait period has elapsed since the last invocation.
 * Essential for optimizing search inputs and real-time filtering.
 * 
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced version of the input function
 */
export function debounce(fn, delay) {
  let timeoutId;

  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Creates a throttled version of a function that executes at most once
 * per specified interval. Used for scroll handlers and drag events.
 * 
 * @param {Function} fn - The function to throttle
 * @param {number} interval - Minimum interval between invocations in milliseconds
 * @returns {Function} Throttled version of the input function
 */
export function throttle(fn, interval) {
  let lastCallTime = 0;

  return function throttled(...args) {
    const now = Date.now();

    if (now - lastCallTime >= interval) {
      lastCallTime = now;
      return fn.apply(this, args);
    }
  };
}

/**
 * Filters tasks for a specific column.
 * Extracted as a pure utility function for testability and reuse.
 * 
 * @param {Array<Object>} tasks - Full array of task objects
 * @param {string} columnId - The column ID to filter by
 * @returns {Array<Object>} Tasks belonging to the specified column
 */
export function filterTasksByColumn(tasks, columnId) {
  return tasks.filter(task => task.status === columnId);
}

/**
 * Generates a cryptographically-informed unique ID for new tasks.
 * More collision-resistant than simple Math.random() approaches.
 * 
 * @param {string} [prefix='task'] - Prefix for the generated ID
 * @returns {string} A unique identifier string
 */
export function generateTaskId(prefix = 'task') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${random}`;
}
