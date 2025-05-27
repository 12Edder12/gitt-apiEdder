import http from 'k6/http'
import { sleep, check } from 'k6'
import { BASE_URL, defaultOptions, getHeaders } from './config.js'

// Test configuration
export const options = defaultOptions

// Main test function
export default function () {
  const headers = getHeaders()

  // Test GET all certificates
  const getAllResponse = http.get(`${BASE_URL}/certificates`, { headers })
  check(getAllResponse, {
    'GET all certificates status is 200': (r) => r.status === 200,
    'GET all certificates response is JSON': (r) =>
      r.headers['Content-Type'] &&
      r.headers['Content-Type'].includes('application/json'),
    'GET all certificates response has data': (r) => {
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
