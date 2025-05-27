import http from 'k6/http'
import { sleep, check } from 'k6'
import { BASE_URL, defaultOptions, getHeaders } from './config.js'

// Test configuration
export const options = defaultOptions

// Main test function
export default function () {
  const headers = getHeaders()

  // For this test, we need to get an item ID first
  // Let's make a request to the items endpoint to get a sample item ID
  // Note: This is a sample approach. In real scenarios, you might want to
  // preconfigure test data or use a specific known item ID

  // Assuming we have an item with ID 1 for testing
  const itemId = 1 // Replace with a valid item ID or fetch dynamically

  // Test GET item-colors by item ID
  const getItemColorsResponse = http.get(
    `${BASE_URL}/item-colors/item/${itemId}`,
    { headers },
  )
  check(getItemColorsResponse, {
    [`GET item-colors for item ${itemId} status is 200`]: (r) =>
      r.status === 200,
    [`GET item-colors for item ${itemId} response is JSON`]: (r) =>
      r.headers['Content-Type'] &&
      r.headers['Content-Type'].includes('application/json'),
    [`GET item-colors for item ${itemId} response has data`]: (r) => {
      try {
        const body = JSON.parse(r.body)
        return (
          body &&
          body.success &&
          body.data &&
          body.data.records &&
          Array.isArray(body.data.records)
        )
      } catch (error) {
        return false
      }
    },
  })

  // Wait between iterations
  sleep(1)
}
