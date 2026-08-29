/* LifeQuest's single source of truth for browser persistence.
   Version 2 imports the old `lifequest-v1` format once, then writes only v2. */
const LifeQuestStorage = (() => {
  const KEY = 'lifequest-v2';
  const LEGACY_KEY = 'lifequest-v1';
  const VERSION = 2;

  const clone = value => JSON.parse(JSON.stringify(value));
  const parse = key => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  };
  const isCurrent = value => value && typeof value === 'object' && value.version === VERSION &&
    Array.isArray(value.habits) && Array.isArray(value.goals) && value.calendar && typeof value.calendar === 'object';

  function read(fallback) {
    const current = parse(KEY);
    if (isCurrent(current)) return current;

    // Existing LifeQuest users retain their data; app-level migration normalizes it.
    const legacy = parse(LEGACY_KEY);
    return legacy && typeof legacy === 'object' ? legacy : clone(fallback);
  }

  function save(state) {
    const snapshot = { ...state, version: VERSION, updatedAt: new Date().toISOString() };
    try {
      localStorage.setItem(KEY, JSON.stringify(snapshot));
      return snapshot;
    } catch (error) {
      console.warn('LifeQuest could not save your latest change.', error);
      return state;
    }
  }

  return { read, save, KEY, VERSION };
})();
