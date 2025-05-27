import http from 'k6/http'
import { sleep, check } from 'k6'
import { BASE_URL, defaultOptions, getHeaders } from './config.js'

// Test configuration
export const options = defaultOptions

// Main test function
export default function () {
  const headers = getHeaders()

  // Test GET all materials
  const getAllResponse = http.get(`${BASE_URL}/materials`, { headers })
  check(getAllResponse, {
    'GET all materials status is 200': (r) => r.status === 200,
    'GET all materials response is JSON': (r) =>
      r.headers['Content-Type'] &&
      r.headers['Content-Type'].includes('application/json'),
    'GET all materials response has data': (r) => {
      const body = JSON.parse(r.body)
      return body && body.data && Array.isArray(body.data)
    },
  })

  // Get a random material ID for individual material test
  let materialId
  try {
    const body = JSON.parse(getAllResponse.body)
    if (body && body.data && body.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * body.data.length)
      materialId = body.data[randomIndex].id
    }
  } catch (error) {
    console.error('Failed to parse response or get material ID:', error)
  }

  // Test GET single material if we have an ID
  if (materialId) {
    const getSingleResponse = http.get(`${BASE_URL}/materials/${materialId}`, {
      headers,
    })
    check(getSingleResponse, {
      [`GET material ${materialId} status is 200`]: (r) => r.status === 200,
      [`GET material ${materialId} response is JSON`]: (r) =>
        r.headers['Content-Type'] &&
        r.headers['Content-Type'].includes('application/json'),
      [`GET material ${materialId} has correct ID`]: (r) => {
        try {
          const body = JSON.parse(r.body)
          return body && body.data && body.data.id === materialId
        } catch (error) {
          return false
        }
      },
    })
  }

  // Wait between iterations
  sleep(1)
}
