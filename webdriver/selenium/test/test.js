const os = require('os');
const path = require('path');
const { expect } = require('chai');
const { spawn, spawnSync } = require('child_process');
const { Builder, By, Capabilities, until } = require('selenium-webdriver');

// create the path to the expected application binary
const application = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'src-tauri',
  'target',
  'release',
  'rainpath'
);

// keep track of the webdriver instance we create
let driver;

// keep track of the tauri-driver process we start
let tauriDriver;

before(async function () {
  // set timeout to 2 minutes to allow the program to build if it needs to
  this.timeout(120000);

  // ensure the program has been built
  console.log('Building Tauri application...');
  const buildResult = spawnSync('cargo', ['build', '--release'], { 
    cwd: path.resolve(__dirname, '..', '..', '..', 'src-tauri'),
    stdio: 'inherit'
  });

  if (buildResult.status !== 0) {
    throw new Error('Failed to build Tauri application');
  }

  // start tauri-driver
  console.log('Starting tauri-driver...');
  tauriDriver = spawn(
    path.resolve(os.homedir(), '.cargo', 'bin', 'tauri-driver'),
    [],
    { stdio: [null, process.stdout, process.stderr] }
  );

  // Wait a moment for tauri-driver to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  const capabilities = new Capabilities();
  capabilities.set('tauri:options', { application });
  capabilities.setBrowserName('wry');

  // start the webdriver client
  console.log('Starting WebDriver client...');
  driver = await new Builder()
    .withCapabilities(capabilities)
    .usingServer('http://127.0.0.1:4444/')
    .build();

  // Make driver globally available for other test files
  global.driver = driver;

  // Wait for the application to load
  await new Promise(resolve => setTimeout(resolve, 3000));
});

after(async function () {
  // stop the webdriver session
  if (driver) {
    await driver.quit();
  }

  // kill the tauri-driver process
  if (tauriDriver) {
    tauriDriver.kill();
  }
});

describe('Rainpath Medical Dashboard', () => {
  it('should load the application window', async () => {
    const title = await driver.getTitle();
    expect(title).to.include('rainpath');
  });

  it('should display the main page content', async () => {
    // Wait for the page to load
    await driver.wait(until.elementLocated(By.css('body')), 10000);
    
    const body = await driver.findElement(By.css('body'));
    const text = await body.getText();
    expect(text).to.not.be.empty;
  });

  it('should have a search interface', async () => {
    // Look for search-related elements
    const searchElements = await driver.findElements(By.css('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]'));
    expect(searchElements.length).to.be.greaterThan(0);
  });

  it('should display medical case data when searched', async () => {
    // Find search input
    const searchInput = await driver.findElement(By.css('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]'));
    
    // Clear and enter a search term
    await searchInput.clear();
    await searchInput.sendKeys('1');
    
    // Wait for results to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if results are displayed
    const results = await driver.findElements(By.css('[data-testid="case-result"], .case-result, .result'));
    expect(results.length).to.be.greaterThan(0);
  });

  it('should handle invalid search input gracefully', async () => {
    // Find search input
    const searchInput = await driver.findElement(By.css('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]'));
    
    // Clear and enter invalid input
    await searchInput.clear();
    await searchInput.sendKeys('invalid');
    
    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check for error message or no results message
    const errorElements = await driver.findElements(By.css('[data-testid="error"], .error, .no-results'));
    expect(errorElements.length).to.be.greaterThan(0);
  });

  it('should have responsive layout', async () => {
    // Check if the application window is properly sized
    const windowSize = await driver.manage().window().getSize();
    expect(windowSize.width).to.be.greaterThan(0);
    expect(windowSize.height).to.be.greaterThan(0);
  });

  it('should display case details when a case is selected', async () => {
    // First search for a case
    const searchInput = await driver.findElement(By.css('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]'));
    await searchInput.clear();
    await searchInput.sendKeys('1');
    
    // Wait for results
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Try to click on a result
    const results = await driver.findElements(By.css('[data-testid="case-result"], .case-result, .result'));
    if (results.length > 0) {
      await results[0].click();
      
      // Wait for details to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if details are displayed
      const detailElements = await driver.findElements(By.css('[data-testid="case-details"], .case-details, .details'));
      expect(detailElements.length).to.be.greaterThan(0);
    }
  });
}); 