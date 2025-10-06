interface AnalyticsEvent {
  name: string;
  payload?: Record<string, unknown>;
  timestamp: string;
}

const subscribers: Array<(event: AnalyticsEvent) => void> = [];

export const logAnalyticsEvent = (name: string, payload?: Record<string, unknown>) => {
  const event: AnalyticsEvent = {
    name,
    payload,
    timestamp: new Date().toISOString(),
  };
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event);
  }
  subscribers.forEach((fn) => fn(event));
};

export const subscribeToAnalytics = (handler: (event: AnalyticsEvent) => void) => {
  subscribers.push(handler);
  return () => {
    const index = subscribers.indexOf(handler);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };
};
