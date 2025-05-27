import http from 'k6/http'
import { sleep, check } from 'k6'
import { BASE_URL, defaultOptions, getHeaders } from './config.js'

// Test configuration
export const options = defaultOptions

// Main test function
export default function () {
  const headers = getHeaders()

  // Test GET all categories
  const getAllResponse = http.get(`${BASE_URL}/categories`, { headers })
  check(getAllResponse, {
    'GET all categories status is 200': (r) => r.status === 200,
    'GET all categories response is JSON': (r) =>
      r.headers['Content-Type'] &&
      r.headers['Content-Type'].includes('application/json'),
    'GET all categories response has data': (r) => {
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
  // Get a random category ID for individual category test
  let categoryId
  try {
    const body = JSON.parse(getAllResponse.body)
    if (
      body &&
      body.data &&
      body.data.records &&
      body.data.records.length > 0
    ) {
      const randomIndex = Math.floor(Math.random() * body.data.records.length)
      categoryId = body.data.records[randomIndex].id
    }
  } catch (error) {
    console.error('Failed to parse response or get category ID:', error)
  }

  // Test GET single category if we have an ID
  if (categoryId) {
    const getSingleResponse = http.get(`${BASE_URL}/categories/${categoryId}`, {
      headers,
    })
    check(getSingleResponse, {
      [`GET category ${categoryId} status is 200`]: (r) => r.status === 200,
      [`GET category ${categoryId} response is JSON`]: (r) =>
        r.headers['Content-Type'] &&
        r.headers['Content-Type'].includes('application/json'),
      [`GET category ${categoryId} has correct ID`]: (r) => {
        try {
          const body = JSON.parse(r.body)
          return (
            body && body.success && body.data && body.data.id === categoryId
          )
        } catch (error) {
          return false
        }
      },
    })
  }

  // Wait between iterations
  sleep(1)
}
