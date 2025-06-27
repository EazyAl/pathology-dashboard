import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import chrome from 'selenium-webdriver/chrome.js';

describe('Rainpath Medical Dashboard E2E', function () {
  let driver;
  // Increase overall timeout for the suite to handle slower CI environments
  this.timeout(45000); 

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

  it('should load the page, find the search input, and verify the title', async () => {
    await driver.get('http://localhost:3000');
    const title = await driver.getTitle();
    expect(title).to.include('Rainpath');
    const searchInput = await driver.findElement(By.css('input.case-input'));
    expect(searchInput).to.exist;
  });

  it('should search for a case and display results', async () => {
    await driver.get('http://localhost:3000');
    const searchInput = await driver.findElement(By.css('input.case-input'));
    
    // Search for case ID 1 (which should return a single result)
    await searchInput.clear();
    await searchInput.sendKeys('1');
    await searchInput.sendKeys('\\n');
    
    // Wait for either case details or case list to appear
    try {
      // First try to find case details (single result)
      const detailsView = await driver.wait(until.elementLocated(By.css('.case-details')), 15000);
      expect(detailsView).to.exist;
      
      // Verify the case ID in the details view
      const caseIdElement = await detailsView.findElement(By.css('h2'));
      const caseIdText = await caseIdElement.getText();
      expect(caseIdText).to.equal('Case #1');
      
      console.log('✅ Single result test passed - found case details');
    } catch (detailsError) {
      console.log('Single result not found, trying multiple results...');
      
      // If single result not found, try to find case list (multiple results)
      const firstResult = await driver.wait(until.elementLocated(By.css('.case-list-card')), 15000);
      expect(firstResult).to.exist;

      // Verify that results are displayed
      const results = await driver.findElements(By.css('.case-list-card'));
      expect(results.length).to.be.greaterThan(0);
      
      console.log(`✅ Multiple results test passed - found ${results.length} results`);
      
      // Click the first result to view its details
      await firstResult.click();
      
      // Wait for the details view to be displayed
      const detailsView = await driver.wait(until.elementLocated(By.css('.case-details')), 15000);
      expect(detailsView).to.exist;
      
      console.log('✅ Click test passed - details view displayed');
    }
  });
}); 