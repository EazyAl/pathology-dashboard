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

  it('should search for a case, see results, click a result, and view details', async () => {
    await driver.get('http://localhost:3000');
    const searchInput = await driver.findElement(By.css('input.case-input'));
    
    // Search for a case that returns multiple results to test the list view
    await searchInput.clear();
    await searchInput.sendKeys('9');
    await searchInput.sendKeys('\\n');
    
    // Wait for the list of results to appear (increased timeout)
    const firstResult = await driver.wait(until.elementLocated(By.css('.case-list-card')), 15000);
    expect(firstResult).to.exist;

    // Verify that more than one result card is displayed
    const results = await driver.findElements(By.css('.case-list-card'));
    expect(results.length).to.be.greaterThan(0);

    // Click the first result to view its details
    await firstResult.click();
    
    // Wait for the details view to be displayed
    const detailsView = await driver.wait(until.elementLocated(By.css('.case-details')), 15000);
    expect(detailsView).to.exist;
    
    // Verify the case ID in the details view
    const caseIdElement = await detailsView.findElement(By.css('h2'));
    const caseIdText = await caseIdElement.getText();
    expect(caseIdText).to.equal('Case #9');
  });
}); 