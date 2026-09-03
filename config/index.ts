/**
 * Application configuration for Qin Star Pay.
 */

export const APP_CONFIG = {
  appName: 'Qin Star Pay',
  appVersion: '1.0.0-phase1',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.qinstarpay.local/v1',
  isDev: process.env.NODE_NODE_ENV !== 'production',
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK === 'true' || true, // Default to true in Phase 1
};
