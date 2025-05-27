import http from 'k6/http'
import { sleep, check } from 'k6'
import { BASE_URL, defaultOptions, getHeaders } from './config.js'

// Test configuration
export const options = defaultOptions

// Main test function
export default function () {
  const headers = getHeaders()

  // Test GET all states
  const getAllResponse = http.get(`${BASE_URL}/states`, { headers })
  check(getAllResponse, {
    'GET all states status is 200': (r) => r.status === 200,
    'GET all states response is JSON': (r) =>
      r.headers['Content-Type'] &&
      r.headers['Content-Type'].includes('application/json'),    'GET all states response has data': (r) => {
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

  // Wait between iterations
  sleep(1)
}
