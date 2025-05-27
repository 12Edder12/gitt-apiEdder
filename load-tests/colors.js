import http from 'k6/http'
import { sleep, check } from 'k6'
import { BASE_URL, defaultOptions, getHeaders } from './config.js'

// Test configuration
export const options = defaultOptions

// Main test function
export default function () {
  const headers = getHeaders()

  // Test GET all colors
  const getAllResponse = http.get(`${BASE_URL}/colors`, { headers })
  check(getAllResponse, {
    'GET all colors status is 200': (r) => r.status === 200,
    'GET all colors response is JSON': (r) =>
      r.headers['Content-Type'] &&
      r.headers['Content-Type'].includes('application/json'),
    'GET all colors response has data': (r) => {
      const body = JSON.parse(r.body)
      return (
        body &&
        body.success &&
        body.data &&
        body.data.records &&
        Array.isArray(body.data.records)
      )
    },
  })
  // Get a random color ID for individual color test
  let colorId
  try {
    const body = JSON.parse(getAllResponse.body)
    if (
      body &&
      body.data &&
      body.data.records &&
      body.data.records.length > 0
    ) {
      const randomIndex = Math.floor(Math.random() * body.data.records.length)
      colorId = body.data.records[randomIndex].id
    }
  } catch (error) {
    console.error('Failed to parse response or get color ID:', error)
  }

  // Test GET single color if we have an ID
  if (colorId) {
    const getSingleResponse = http.get(`${BASE_URL}/colors/${colorId}`, {
      headers,
    })
    check(getSingleResponse, {
      [`GET color ${colorId} status is 200`]: (r) => r.status === 200,
      [`GET color ${colorId} response is JSON`]: (r) =>
        r.headers['Content-Type'] &&
        r.headers['Content-Type'].includes('application/json'),
      [`GET color ${colorId} has correct ID`]: (r) => {
        try {
          const body = JSON.parse(r.body)
          return body && body.success && body.data && body.data.id === colorId
        } catch (error) {
          return false
        }
      },
    })
  }

  // Wait between iterations
  sleep(1)
}
