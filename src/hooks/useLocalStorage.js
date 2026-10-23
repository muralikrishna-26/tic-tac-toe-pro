import { useEffect, useState } from 'react';

// Reads and validates saved data. Any problem (blocked storage, bad JSON,
// wrong shape) falls back to the default so the app never crashes.
function readStorage(key, fallback, validate) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function isStorageAvailable() {
  try {
    const testKey = '__ttt_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// Works like useState, but the value is saved in localStorage too.
export function useLocalStorage(key, initialValue, validate = () => true) {
  const [value, setValue] = useState(() => readStorage(key, initialValue, validate));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage is unavailable or full. The app keeps working in memory.
    }
  }, [key, value]);

  return [value, setValue];
}
