const { expect } = require('chai');
const { By, until } = require('selenium-webdriver');
const { 
  waitForElement, 
  clearAndType, 
  waitForText, 
  takeScreenshot,
  elementExists,
  getAllElements
} = require('./helpers');

describe('Medical Case Search', () => {
  let driver;

  before(async function() {
    // Get the driver from the global setup
    driver = global.driver;
  });

  describe('Search Interface', () => {
    it('should have a search input field', async () => {
      const searchInput = await waitForElement(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]');
      expect(searchInput).to.exist;
    });

    it('should have a search button or submit functionality', async () => {
      const searchButton = await elementExists(driver, 'button[type="submit"], button:contains("Search"), input[type="submit"]');
      expect(searchButton).to.be.true;
    });
  });

  describe('Search Functionality', () => {
    it('should search for case ID 1 and display results', async () => {
      // Find and fill search input
      const searchInput = await waitForElement(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]');
      await clearAndType(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]', '1');
      
      // Submit search (either by pressing Enter or clicking button)
      await searchInput.sendKeys('\n');
      
      // Wait for results to load
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Take screenshot for debugging
      await takeScreenshot(driver, 'search-results-case-1');
      
      // Check for results
      const results = await getAllElements(driver, '[data-testid="case-result"], .case-result, .result, .search-result, .case-item');
      expect(results.length).to.be.greaterThan(0);
    });

    it('should search for case ID 9 and display multiple results', async () => {
      // Find and fill search input
      await clearAndType(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]', '9');
      
      // Submit search
      const searchInput = await waitForElement(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]');
      await searchInput.sendKeys('\n');
      
      // Wait for results
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Take screenshot
      await takeScreenshot(driver, 'search-results-case-9');
      
      // Check for multiple results
      const results = await getAllElements(driver, '[data-testid="case-result"], .case-result, .result, .search-result, .case-item');
      expect(results.length).to.be.greaterThan(1);
    });

    it('should handle search for non-existent case ID', async () => {
      // Search for a non-existent case
      await clearAndType(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]', '999');
      
      // Submit search
      const searchInput = await waitForElement(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]');
      await searchInput.sendKeys('\n');
      
      // Wait for response
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Take screenshot
      await takeScreenshot(driver, 'search-no-results');
      
      // Check for no results message
      const noResults = await elementExists(driver, '[data-testid="no-results"], .no-results, .error, .not-found');
      expect(noResults).to.be.true;
    });

    it('should handle invalid input gracefully', async () => {
      // Search with invalid input
      await clearAndType(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]', 'abc');
      
      // Submit search
      const searchInput = await waitForElement(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]');
      await searchInput.sendKeys('\n');
      
      // Wait for response
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Take screenshot
      await takeScreenshot(driver, 'search-invalid-input');
      
      // Check for error message
      const errorMessage = await elementExists(driver, '[data-testid="error"], .error, .invalid-input, .validation-error');
      expect(errorMessage).to.be.true;
    });
  });

  describe('Case Details', () => {
    it('should display case details when a case is clicked', async () => {
      // First search for a case
      await clearAndType(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]', '1');
      
      // Submit search
      const searchInput = await waitForElement(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]');
      await searchInput.sendKeys('\n');
      
      // Wait for results
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Click on first result
      const results = await getAllElements(driver, '[data-testid="case-result"], .case-result, .result, .search-result, .case-item');
      if (results.length > 0) {
        await results[0].click();
        
        // Wait for details to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Take screenshot
        await takeScreenshot(driver, 'case-details');
        
        // Check for details content
        const details = await elementExists(driver, '[data-testid="case-details"], .case-details, .details, .case-info');
        expect(details).to.be.true;
      }
    });

    it('should display medical information in case details', async () => {
      // Search and click on a case
      await clearAndType(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]', '1');
      
      const searchInput = await waitForElement(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]');
      await searchInput.sendKeys('\n');
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const results = await getAllElements(driver, '[data-testid="case-result"], .case-result, .result, .search-result, .case-item');
      if (results.length > 0) {
        await results[0].click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check for medical information fields
        const hasMedicalInfo = await elementExists(driver, '[data-testid="diagnosis"], .diagnosis, .medical-info, .pathology, .symptoms');
        expect(hasMedicalInfo).to.be.true;
      }
    });
  });

  describe('User Experience', () => {
    it('should provide visual feedback during search', async () => {
      // Start a search
      await clearAndType(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]', '1');
      
      const searchInput = await waitForElement(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]');
      await searchInput.sendKeys('\n');
      
      // Check for loading indicator
      const loadingIndicator = await elementExists(driver, '[data-testid="loading"], .loading, .spinner, .loader');
      expect(loadingIndicator).to.be.true;
      
      // Wait for results
      await new Promise(resolve => setTimeout(resolve, 3000));
    });

    it('should maintain search state after navigation', async () => {
      // Perform a search
      await clearAndType(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]', '1');
      
      const searchInput = await waitForElement(driver, 'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"]');
      await searchInput.sendKeys('\n');
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check that search input retains the value
      const inputValue = await searchInput.getAttribute('value');
      expect(inputValue).to.equal('1');
    });
  });
}); 