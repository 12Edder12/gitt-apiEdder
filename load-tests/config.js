// Common configuration for all K6 tests
export const BASE_URL = 'http://localhost:3000/api/v1'

// Default options for tests
export const defaultOptions = {
  // A basic test configuration
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users over 30 seconds
    { duration: '1m', target: 20 }, // Stay at 20 users for 1 minute
    { duration: '30s', target: 0 }, // Ramp down to 0 users over 30 seconds
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete within 500ms
    http_req_failed: ['rate<0.01'], // Less than 1% of requests should fail
  },
}

// Heavy load test configuration
export const heavyLoadOptions = {
  stages: [
    { duration: '1m', target: 50 }, // Ramp up to 50 users over 1 minute
    { duration: '3m', target: 50 }, // Stay at 50 users for 3 minutes
    { duration: '1m', target: 0 }, // Ramp down to 0 users over 1 minute
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'], // 95% of requests must complete within 800ms
    http_req_failed: ['rate<0.02'], // Less than 2% of requests should fail
  },
}

// Function to create a header with authentication if needed
export function getHeaders(authToken = '') {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  return headers
}
