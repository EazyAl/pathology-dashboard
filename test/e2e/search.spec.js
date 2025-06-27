import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import chrome from 'selenium-webdriver/chrome.js';

describe('Rainpath Medical Dashboard E2E', function () {
  let driver;
  this.timeout(30000);

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

  it('should load the page and verify search functionality', async () => {
    await driver.get('http://localhost:3000');
    
    // Verify page loads with correct title
    const title = await driver.getTitle();
    expect(title).to.include('Rainpath');
    
    // Find and verify search input exists
    const searchInput = await driver.findElement(By.css('input.case-input'));
    expect(searchInput).to.exist;
    
    // Search for case ID 9 (should return multiple results)
    await searchInput.clear();
    await searchInput.sendKeys('9');
    await searchInput.sendKeys('\\n');
    
    // Wait for search results to appear
    await driver.wait(until.elementLocated(By.css('.case-list-card')), 15000);
    
    // Verify multiple results are displayed
    const results = await driver.findElements(By.css('.case-list-card'));
    expect(results.length).to.be.greaterThan(1);
  });
}); 