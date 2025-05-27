# K6 Load Testing Scripts for GITT API

This directory contains a set of load testing scripts for the GITT API using K6, a modern load testing tool.

## Setup

K6 has already been installed on your system. You can verify it with:

```
k6 version
```

## Available Test Scripts

The following test scripts are available for different API endpoints:

- `categories.js`: Tests /categories endpoints
- `certificates.js`: Tests /certificates endpoint
- `colors.js`: Tests /colors endpoints
- `conditions.js`: Tests /conditions endpoints
- `item-colors.js`: Tests /item-colors/item/{id} endpoint
- `users.js`: Tests /users endpoints
- `states.js`: Tests /states endpoint
- `materials.js`: Tests /materials endpoints
- `all-endpoints.js`: Tests all endpoints in a single run

## Running Tests

To run a test for a specific endpoint, use:

```powershell
k6 run load-tests/[script-name].js
```

For example:

```powershell
k6 run load-tests/categories.js
```

To run tests for all endpoints:

```powershell
k6 run load-tests/all-endpoints.js
```

## Customizing Tests

You can customize the test configuration by editing the `config.js` file:

- `defaultOptions`: Default test configuration with moderate load
- `heavyLoadOptions`: Configuration for heavy load testing

## Authentication

If your API endpoints require authentication, you can modify the `getHeaders` function in `config.js` to include the appropriate authentication token.

## Example Commands

1. Run load test on categories endpoint:
   ```powershell
   k6 run load-tests/categories.js
   ```

2. Run load test on all endpoints:
   ```powershell
   k6 run load-tests/all-endpoints.js
   ```

3. Run with custom options (example: increasing the number of virtual users):
   ```powershell
   k6 run --vus 50 --duration 2m load-tests/categories.js
   ```

4. Output test results to a JSON file:
   ```powershell
   k6 run --out json=results.json load-tests/all-endpoints.js
   ```
