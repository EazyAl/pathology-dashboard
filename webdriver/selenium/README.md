# Selenium Testing for Rainpath Medical Dashboard

This directory contains end-to-end tests for the Rainpath medical dashboard using Selenium WebDriver. We focus on testing the **web interface** rather than the Tauri desktop app to avoid complex system dependency issues in CI/CD environments.

## Testing Strategy

### Why Web-Only Testing?
- **Reliability**: Avoids complex Linux system dependencies (GLib, GObject, GIO) required for Tauri builds
- **Speed**: Faster CI/CD execution without Rust compilation
- **Coverage**: Tests the core search functionality that's identical between web and desktop
- **Maintainability**: Simpler setup and debugging

### What We Test
- ✅ **Search Interface**: Input field, validation, submission
- ✅ **Search Results**: Single and multiple result displays
- ✅ **Error Handling**: Invalid input, non-existent cases
- ✅ **User Interactions**: Clicking results, navigation
- ✅ **API Integration**: Backend search functionality

## Prerequisites

1. **Node.js Dependencies**: Install the testing dependencies
   ```bash
   pnpm install
   ```

2. **Chrome/Chromium**: For local testing (automatically installed in CI)

## Test Structure

- `test/test.js` - Original Tauri tests (for local development)
- `test/case-search.test.js` - Medical case search specific tests
- `test/web-interface.test.js` - Web-only tests (generated in CI)
- `test/helpers.js` - Common test utilities and helper functions
- `.mocharc.js` - Mocha test runner configuration

## Running Tests

### Local Development (Web Interface)
```bash
# Start the development server
pnpm dev

# In another terminal, run web tests
pnpm test:e2e:web
```

### Local Development (Tauri - macOS/Windows)
```bash
# Install Tauri driver
cargo install tauri-driver

# Build and run Tauri tests
pnpm test:e2e
```

### CI/CD (GitHub Actions)
The CI automatically runs web-based tests that are more reliable and faster.

## Test Features

### Screenshots
Tests automatically take screenshots when they encounter issues or at key points. Screenshots are saved in `test/screenshots/`.

### Test Categories

1. **Application Loading**
   - Page title verification
   - Main page content display
   - Search interface presence

2. **Search Interface**
   - Search input field presence
   - Input validation (numeric only)
   - Search button functionality

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

1. **Tauri Build Fails on Linux**
   - **Solution**: Use web-based testing instead
   - **Why**: Linux requires complex system dependencies that are hard to manage in CI

2. **Chrome/ChromeDriver Issues**
   ```bash
   # Install Chrome and ChromeDriver
   sudo apt-get install -y chromium-browser chromium-chromedriver
   ```

3. **Port 3000 Already in Use**
   ```bash
   # Kill existing processes
   pkill -f "next"
   ```

4. **Tests Time Out**
   - Increase timeout in `.mocharc.js`
   - Check if the Next.js server is running properly

### Debug Mode

Run tests with debug information:
```bash
DEBUG=* pnpm test:e2e:web
```

### Manual Testing

To manually test the web interface:
```bash
# Start the server
pnpm dev

# Open browser to http://localhost:3000
# Test search functionality manually
```

## CI/CD Integration

The GitHub Actions workflow automatically:
1. Installs dependencies
2. Builds the frontend
3. Starts the Next.js server
4. Runs Selenium tests against the web interface
5. Captures screenshots on failure

## Test Maintenance

### Adding New Tests

1. Create a new test file in the `test/` directory
2. Import the helper functions from `helpers.js`
3. Use the web interface selectors
4. Follow the existing test patterns

### Updating Selectors

If your UI changes, update the CSS selectors in the test files. Common selectors:
- Search input: `input[type="number"]`
- Results: `.case-list-card, .case-details`
- Error messages: `.error-message`

### Performance Optimization

- Use `waitForElement` instead of fixed timeouts
- Take screenshots only when needed
- Group related tests together
- Clean up test state between tests

## Migration from Tauri Testing

If you need to test the actual Tauri desktop app:

1. **Local Development**: Use `pnpm test:e2e` on macOS/Windows
2. **CI/CD**: Consider using Windows runners for Tauri testing
3. **Alternative**: Use Playwright for cross-platform testing

The web interface testing provides excellent coverage of the core functionality while being much more reliable in CI/CD environments. 