import http from 'k6/http'
import { sleep, check, group } from 'k6'
import { BASE_URL, heavyLoadOptions, getHeaders } from './config.js'

// Test configuration - using heavier load for combined testing
export const options = heavyLoadOptions

// Main test function
export default function () {
  const headers = getHeaders()

  // Test all endpoints in sequence with different user groups
  group('Categories', function () {
    testCategories(headers)
  })

  group('Certificates', function () {
    testCertificates(headers)
  })

  group('Colors', function () {
    testColors(headers)
  })

  group('Conditions', function () {
    testConditions(headers)
  })

  group('Users', function () {
    testUsers(headers)
  })

  group('States', function () {
    testStates(headers)
  })

  group('Materials', function () {
    testMaterials(headers)
  })

  group('Item Colors', function () {
    testItemColors(headers)
  })

  // Wait between iterations
  sleep(1)
}

// Helper functions for each endpoint group
function testCategories(headers) {
  const resp = http.get(`${BASE_URL}/categories`, { headers })
  check(resp, { 'Categories status is 200': (r) => r.status === 200 })
}

function testCertificates(headers) {
  const resp = http.get(`${BASE_URL}/certificates`, { headers })
  check(resp, { 'Certificates status is 200': (r) => r.status === 200 })
}

function testColors(headers) {
  const resp = http.get(`${BASE_URL}/colors`, { headers })
  check(resp, { 'Colors status is 200': (r) => r.status === 200 })
}

function testConditions(headers) {
  const resp = http.get(`${BASE_URL}/conditions`, { headers })
  check(resp, { 'Conditions status is 200': (r) => r.status === 200 })
}

function testUsers(headers) {
  const resp = http.get(`${BASE_URL}/users`, { headers })
  check(resp, { 'Users status is 200': (r) => r.status === 200 })
}

function testStates(headers) {
  const resp = http.get(`${BASE_URL}/states`, { headers })
  check(resp, { 'States status is 200': (r) => r.status === 200 })
}

function testMaterials(headers) {
  const resp = http.get(`${BASE_URL}/materials`, { headers })
  check(resp, { 'Materials status is 200': (r) => r.status === 200 })
}

function testItemColors(headers) {
  // Using item ID 1 as example - replace with a valid ID
  const resp = http.get(`${BASE_URL}/item-colors/item/1`, { headers })
  check(resp, { 'Item Colors status is 200': (r) => r.status === 200 })
}
