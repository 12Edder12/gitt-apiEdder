import http from 'k6/http'
import { sleep, check } from 'k6'
import { BASE_URL, defaultOptions, getHeaders } from './config.js'

// Test configuration
export const options = defaultOptions

// Main test function
export default function () {
  const headers = getHeaders()

  // Test GET all users
  const getAllResponse = http.get(`${BASE_URL}/users`, { headers })
  check(getAllResponse, {
    'GET all users status is 200': (r) => r.status === 200,
    'GET all users response is JSON': (r) =>
      r.headers['Content-Type'] &&
      r.headers['Content-Type'].includes('application/json'),
    'GET all users response has data': (r) => {
      const body = JSON.parse(r.body)
      return body && body.data && Array.isArray(body.data)
    },
  })

  // Get a random user ID for individual user test
  let userId
  try {
    const body = JSON.parse(getAllResponse.body)
    if (body && body.data && body.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * body.data.length)
      userId = body.data[randomIndex].id
    }
  } catch (error) {
    console.error('Failed to parse response or get user ID:', error)
  }

  // Test GET single user if we have an ID
  if (userId) {
    const getSingleResponse = http.get(`${BASE_URL}/users/${userId}`, {
      headers,
    })
    check(getSingleResponse, {
      [`GET user ${userId} status is 200`]: (r) => r.status === 200,
      [`GET user ${userId} response is JSON`]: (r) =>
        r.headers['Content-Type'] &&
        r.headers['Content-Type'].includes('application/json'),
      [`GET user ${userId} has correct ID`]: (r) => {
        try {
          const body = JSON.parse(r.body)
          return body && body.data && body.data.id === userId
        } catch (error) {
          return false
        }
      },
    })
  }

  // Wait between iterations
  sleep(1)
}
