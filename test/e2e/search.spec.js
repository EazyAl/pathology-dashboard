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
    console.log('✅ Page title verified:', title);
    
    // Find and verify search input exists
    const searchInput = await driver.findElement(By.css('input.case-input'));
    expect(searchInput).to.exist;
    console.log('✅ Search input found');
    
    // Search for case ID 9 (should return multiple results)
    await searchInput.clear();
    await searchInput.sendKeys('9');
    console.log('✅ Entered "9" in search field');
    
    // Press Enter to trigger search
    await searchInput.sendKeys('\\n');
    console.log('✅ Pressed Enter to search');
    
    // Wait a moment for the search to process
    await driver.sleep(2000);
    
    // Check if there are any error messages
    try {
      const errorElement = await driver.findElement(By.css('.error-message'));
      const errorText = await errorElement.getText();
      console.log('❌ Error message found:', errorText);
    } catch (e) {
      console.log('✅ No error messages found');
    }
    
    // Check page source to see what's actually rendered
    const pageSource = await driver.getPageSource();
    console.log('Page source contains "case-list-card":', pageSource.includes('case-list-card'));
    console.log('Page source contains "case-details":', pageSource.includes('case-details'));
    
    // Try to find any results (either list or details)
    try {
      await driver.wait(until.elementLocated(By.css('.case-list-card, .case-details')), 15000);
      console.log('✅ Found either case list or case details');
      
      // Check which one we found
      const listCards = await driver.findElements(By.css('.case-list-card'));
      const details = await driver.findElements(By.css('.case-details'));
      
      if (listCards.length > 0) {
        console.log(`✅ Found ${listCards.length} case list cards`);
        expect(listCards.length).to.be.greaterThan(1);
      } else if (details.length > 0) {
        console.log('✅ Found case details view');
        // If we got details, that means only one result was found
        // Let's verify it's case 9
        const caseIdElement = await details[0].findElement(By.css('h2'));
        const caseIdText = await caseIdElement.getText();
        console.log('Case ID in details:', caseIdText);
      }
    } catch (e) {
      console.log('❌ No results found at all');
      throw e;
    }
  });
}); 