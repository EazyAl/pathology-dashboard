import { test, expect } from '@playwright/test';

test.describe('Medical Case Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the main page', async ({ page }) => {
    await expect(page).toHaveTitle(/rainpath/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have a search interface', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
  });

  test('should search for case ID 1 and display results', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]');
    
    await searchInput.fill('1');
    await searchInput.press('Enter');
    
    // Wait for results to load
    await page.waitForTimeout(2000);
    
    // Check for results
    const results = page.locator('[data-testid="case-result"], .case-result, .result, .search-result');
    await expect(results.first()).toBeVisible();
  });

  test('should search for case ID 9 and display multiple results', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]');
    
    await searchInput.fill('9');
    await searchInput.press('Enter');
    
    await page.waitForTimeout(2000);
    
    const results = page.locator('[data-testid="case-result"], .case-result, .result, .search-result');
    const count = await results.count();
    expect(count).toBeGreaterThan(1);
  });

  test('should handle search for non-existent case ID', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]');
    
    await searchInput.fill('999');
    await searchInput.press('Enter');
    
    await page.waitForTimeout(2000);
    
    const noResults = page.locator('[data-testid="no-results"], .no-results, .error, .not-found');
    await expect(noResults).toBeVisible();
  });

  test('should handle invalid input gracefully', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]');
    
    await searchInput.fill('abc');
    await searchInput.press('Enter');
    
    await page.waitForTimeout(2000);
    
    const errorMessage = page.locator('[data-testid="error"], .error, .invalid-input, .validation-error');
    await expect(errorMessage).toBeVisible();
  });

  test('should display case details when a case is clicked', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]');
    
    await searchInput.fill('1');
    await searchInput.press('Enter');
    
    await page.waitForTimeout(2000);
    
    const results = page.locator('[data-testid="case-result"], .case-result, .result, .search-result');
    if (await results.count() > 0) {
      await results.first().click();
      
      await page.waitForTimeout(1000);
      
      const details = page.locator('[data-testid="case-details"], .case-details, .details, .case-info');
      await expect(details).toBeVisible();
    }
  });

  test('should provide visual feedback during search', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]');
    
    await searchInput.fill('1');
    await searchInput.press('Enter');
    
    // Check for loading indicator
    const loadingIndicator = page.locator('[data-testid="loading"], .loading, .spinner, .loader');
    await expect(loadingIndicator).toBeVisible();
    
    await page.waitForTimeout(3000);
  });
}); 