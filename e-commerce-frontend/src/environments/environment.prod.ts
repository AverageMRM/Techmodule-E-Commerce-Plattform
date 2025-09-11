export const environment = {
  production: true,
  // In production behind Docker Compose, the web app is typically served by Nginx
  // and should call the API via the same origin + /api (recommended) or service DNS.
  // Adjust if you place an Nginx reverse proxy in front that proxies /api -> api:8080
  apiBaseUrl: '/api',
  locale: 'de-CH',
  currency: 'CHF',
  stripePublishableKey: 'pk_test_1234567890',
  googleClientId: '' // optional: set to enable real Google Identity in frontend
};
