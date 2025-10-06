const STORAGE_KEY = 'redhat-funding-application';

export const loadApplication = <T,>(fallback: T): T => {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (!item) return fallback;
    return { ...fallback, ...JSON.parse(item) };
  } catch (error) {
    console.warn('Failed to load application from storage', error);
    return fallback;
  }
};

export const saveApplication = (data: unknown) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to persist application', error);
  }
};

export const clearApplication = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear application', error);
  }
};
