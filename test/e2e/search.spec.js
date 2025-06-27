const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const chrome = require('selenium-webdriver/chrome');

describe('Rainpath Medical Dashboard E2E', function () {
  let driver;
  this.timeout(30000); // Set a longer timeout for all tests in this suite

  before(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu');
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('should load the web interface and find the correct title', async () => {
    await driver.get('http://localhost:3000');
    const title = await driver.getTitle();
    expect(title).to.include('Rainpath');
  });

  it('should find the search input field', async () => {
    await driver.get('http://localhost:3000');
    const searchInput = await driver.findElement(By.css('input[type="number"]'));
    expect(searchInput).to.exist;
  });

  it('should search for case ID 1 and display results', async () => {
    await driver.get('http://localhost:3000');
    const searchInput = await driver.findElement(By.css('input[type="number"]'));
    
    await searchInput.clear();
    await searchInput.sendKeys('1');
    await searchInput.sendKeys('\\n');
    
    await driver.wait(until.elementLocated(By.css('.case-list-card, .case-details')), 5000);
    const results = await driver.findElements(By.css('.case-list-card, .case-details'));
    expect(results.length).to.be.greaterThan(0);
  });

  it('should display details when a case result is clicked', async () => {
    await driver.get('http://localhost:3000');
    const searchInput = await driver.findElement(By.css('input[type="number"]'));
    
    await searchInput.clear();
    await searchInput.sendKeys('1');
    await searchInput.sendKeys('\\n');
    
    const firstResult = await driver.wait(until.elementLocated(By.css('.case-list-card')), 5000);
    await firstResult.click();
    
    const details = await driver.wait(until.elementLocated(By.css('.case-details')), 5000);
    expect(details).to.exist;
  });
}); 