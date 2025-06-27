# Selenium Testing for Rainpath Medical Dashboard

This directory contains end-to-end tests for the Rainpath medical dashboard using Selenium WebDriver with Tauri's WebDriver support.

## Prerequisites

1. **Tauri Driver**: Install the Tauri WebDriver
   ```bash
   cargo install tauri-driver
   ```

2. **Node.js Dependencies**: Install the testing dependencies
   ```bash
   pnpm install
   ```

3. **Rust Toolchain**: Ensure you have Rust installed and the project builds
   ```bash
   cargo build --release
   ```

## Test Structure

- `test/test.js` - Main test file with basic application tests
- `test/case-search.test.js` - Specific tests for medical case search functionality
- `test/helpers.js` - Common test utilities and helper functions
- `.mocharc.js` - Mocha test runner configuration

## Running Tests

### Run All Tests
```bash
pnpm test
```

### Run Tests in Watch Mode
```bash
pnpm test:watch
```

### Run Tests with Debug
```bash
pnpm test:debug
```

### Run Specific Test File
```bash
npx mocha test/case-search.test.js
```

## Test Features

### Screenshots
Tests automatically take screenshots when they encounter issues or at key points. Screenshots are saved in `test/screenshots/`.

### Test Categories

1. **Application Loading**
   - Window title verification
   - Main page content display
   - Responsive layout

2. **Search Interface**
   - Search input field presence
   - Search button functionality
   - Input validation

3. **Search Functionality**
   - Case ID search (single result)
   - Multiple results search
   - Non-existent case handling
   - Invalid input handling

4. **Case Details**
   - Case selection and display
   - Medical information display
   - Navigation state management

5. **User Experience**
   - Loading indicators
   - Visual feedback
   - State persistence

## Test Data

The tests use the following case IDs from your medical pathology data:
- Case ID `1` - Single result test
- Case ID `9` - Multiple results test
- Case ID `999` - Non-existent case test
- `abc` - Invalid input test

## Troubleshooting

### Common Issues

1. **Tauri Driver Not Found**
   ```bash
   cargo install tauri-driver
   ```

2. **Application Build Fails**
   ```bash
   cd ../../src-tauri
   cargo build --release
   ```

3. **Port 4444 Already in Use**
   - Kill any existing tauri-driver processes
   - Restart the test suite

4. **Tests Time Out**
   - Increase timeout in `.mocharc.js`
   - Check if the application is loading properly

### Debug Mode

Run tests with debug information:
```bash
DEBUG=* pnpm test
```

### Manual Testing

To manually test the WebDriver setup:
```bash
# Start tauri-driver
tauri-driver

# In another terminal, run a simple test
npx mocha test/test.js --grep "should load the application window"
```

## Integration with CI/CD

These tests can be integrated into your GitHub Actions workflow. Add the following to your CI pipeline:

```yaml
- name: Install Tauri Driver
  run: cargo install tauri-driver

- name: Run Selenium Tests
  run: |
    cd webdriver/selenium
    pnpm install
    pnpm test
```

## Test Maintenance

### Adding New Tests

1. Create a new test file in the `test/` directory
2. Import the helper functions from `helpers.js`
3. Use the global `driver` instance
4. Follow the existing test patterns

### Updating Selectors

If your UI changes, update the CSS selectors in the test files. Common selectors to check:
- Search input: `input[type="text"], input[placeholder*="search"]`
- Results: `[data-testid="case-result"], .case-result, .result`
- Error messages: `[data-testid="error"], .error, .no-results`

### Performance Optimization

- Use `waitForElement` instead of fixed timeouts
- Take screenshots only when needed
- Group related tests together
- Clean up test state between tests 