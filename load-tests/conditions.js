import http from 'k6/http'
import { sleep, check } from 'k6'
import { BASE_URL, defaultOptions, getHeaders } from './config.js'

// Test configuration
export const options = defaultOptions

// Main test function
export default function () {
  const headers = getHeaders()

  // Test GET all conditions
  const getAllResponse = http.get(`${BASE_URL}/conditions`, { headers })
  check(getAllResponse, {
    'GET all conditions status is 200': (r) => r.status === 200,
    'GET all conditions response is JSON': (r) =>
      r.headers['Content-Type'] &&
      r.headers['Content-Type'].includes('application/json'),
    'GET all conditions response has data': (r) => {
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
  // Get a random condition ID for individual condition test
  let conditionId
  try {
    const body = JSON.parse(getAllResponse.body)
    if (
      body &&
      body.data &&
      body.data.records &&
      body.data.records.length > 0
    ) {
      const randomIndex = Math.floor(Math.random() * body.data.records.length)
      conditionId = body.data.records[randomIndex].id
    }
  } catch (error) {
    console.error('Failed to parse response or get condition ID:', error)
  }

  // Test GET single condition if we have an ID
  if (conditionId) {
    const getSingleResponse = http.get(
      `${BASE_URL}/conditions/${conditionId}`,
      { headers },
    )
    check(getSingleResponse, {
      [`GET condition ${conditionId} status is 200`]: (r) => r.status === 200,
      [`GET condition ${conditionId} response is JSON`]: (r) =>
        r.headers['Content-Type'] &&
        r.headers['Content-Type'].includes('application/json'),
      [`GET condition ${conditionId} has correct ID`]: (r) => {
        try {
          const body = JSON.parse(r.body)
          return (
            body && body.success && body.data && body.data.id === conditionId
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
