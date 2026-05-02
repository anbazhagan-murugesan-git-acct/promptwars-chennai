import { memoize, debounce, throttle, filterTasksByColumn, generateTaskId } from '../lib/performance';

describe('Performance Utilities', () => {
  describe('memoize', () => {
    test('caches repeated function calls with same arguments', () => {
      let callCount = 0;
      const expensive = (n) => { callCount++; return n * 2; };
      const memoized = memoize(expensive);

      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);
      expect(callCount).toBe(1); // Only called once due to cache
    });

    test('evicts oldest entry when cache exceeds max size', () => {
      const fn = (n) => n;
      const memoized = memoize(fn, 2);

      memoized(1);
      memoized(2);
      memoized(3); // Should evict key for argument 1

      // Re-calling with 1 should trigger a new computation
      let callCount = 0;
      const tracked = memoize((n) => { callCount++; return n; }, 2);
      tracked(1);
      tracked(2);
      tracked(3);
      tracked(1); // Cache miss, re-computed
      expect(callCount).toBe(4);
    });
  });

  describe('filterTasksByColumn', () => {
    const tasks = [
      { id: '1', status: 'todo', title: 'A' },
      { id: '2', status: 'done', title: 'B' },
      { id: '3', status: 'todo', title: 'C' },
    ];

    test('returns only tasks matching the column ID', () => {
      expect(filterTasksByColumn(tasks, 'todo')).toHaveLength(2);
      expect(filterTasksByColumn(tasks, 'done')).toHaveLength(1);
    });

    test('returns empty array for non-existent column', () => {
      expect(filterTasksByColumn(tasks, 'backlog')).toHaveLength(0);
    });
  });

  describe('generateTaskId', () => {
    test('generates unique IDs with correct prefix', () => {
      const id1 = generateTaskId('ai');
      const id2 = generateTaskId('ai');
      expect(id1).toMatch(/^ai-/);
      expect(id1).not.toBe(id2);
    });

    test('uses default prefix when none provided', () => {
      const id = generateTaskId();
      expect(id).toMatch(/^task-/);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    test('delays execution until after wait period', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 300);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();
      jest.advanceTimersByTime(300);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    test('executes immediately on first call', () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 1000);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
