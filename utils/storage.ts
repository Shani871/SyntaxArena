const STORAGE_EVENT = 'syntaxarena:storage';

export const storageKeys = {
  scheduledBattles: 'scheduled_battles',
  documents: 'syntaxarena_docs',
  settings: 'syntaxarena_settings',
} as const;

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const emitStorageEvent = (key: string) => {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
};

export const readStorage = <T>(key: string, fallback: T): T => {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (error) {
    console.warn(`Failed to read localStorage key "${key}"`, error);
    return fallback;
  }
};

export const writeStorage = <T>(key: string, value: T) => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    emitStorageEvent(key);
  } catch (error) {
    console.warn(`Failed to write localStorage key "${key}"`, error);
  }
};

export const removeStorage = (key: string) => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
    emitStorageEvent(key);
  } catch (error) {
    console.warn(`Failed to remove localStorage key "${key}"`, error);
  }
};

export const subscribeToStorage = (key: string, callback: () => void) => {
  if (!isBrowser()) {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === key) {
      callback();
    }
  };

  const onCustomStorage = (event: Event) => {
    const detail = (event as CustomEvent<{ key?: string }>).detail;
    if (detail?.key === key) {
      callback();
    }
  };

  window.addEventListener('storage', onStorage);
  window.addEventListener(STORAGE_EVENT, onCustomStorage);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(STORAGE_EVENT, onCustomStorage);
  };
};
