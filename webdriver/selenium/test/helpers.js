const { By, until } = require('selenium-webdriver');

/**
 * Wait for an element to be present and visible
 * @param {WebDriver} driver - The WebDriver instance
 * @param {string} selector - CSS selector for the element
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<WebElement>} The found element
 */
async function waitForElement(driver, selector, timeout = 10000) {
  await driver.wait(until.elementLocated(By.css(selector)), timeout);
  const element = await driver.findElement(By.css(selector));
  await driver.wait(until.elementIsVisible(element), timeout);
  return element;
}

/**
 * Wait for an element to have specific text
 * @param {WebDriver} driver - The WebDriver instance
 * @param {string} selector - CSS selector for the element
 * @param {string} text - Expected text content
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForText(driver, selector, text, timeout = 10000) {
  await driver.wait(async () => {
    try {
      const element = await driver.findElement(By.css(selector));
      const elementText = await element.getText();
      return elementText.includes(text);
    } catch (error) {
      return false;
    }
  }, timeout);
}

/**
 * Wait for page to load completely
 * @param {WebDriver} driver - The WebDriver instance
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForPageLoad(driver, timeout = 10000) {
  await driver.wait(async () => {
    const readyState = await driver.executeScript('return document.readyState');
    return readyState === 'complete';
  }, timeout);
}

/**
 * Take a screenshot and save it
 * @param {WebDriver} driver - The WebDriver instance
 * @param {string} filename - Name of the screenshot file
 */
async function takeScreenshot(driver, filename) {
  try {
    const screenshot = await driver.takeScreenshot();
    const fs = require('fs');
    const path = require('path');
    const screenshotDir = path.join(__dirname, 'screenshots');
    
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    const filePath = path.join(screenshotDir, `${filename}.png`);
    fs.writeFileSync(filePath, screenshot, 'base64');
    console.log(`Screenshot saved: ${filePath}`);
  } catch (error) {
    console.error('Failed to take screenshot:', error);
  }
}

/**
 * Clear and type text into an input field
 * @param {WebDriver} driver - The WebDriver instance
 * @param {string} selector - CSS selector for the input
 * @param {string} text - Text to type
 */
async function clearAndType(driver, selector, text) {
  const input = await waitForElement(driver, selector);
  await input.clear();
  await input.sendKeys(text);
}

/**
 * Click an element and wait for a condition
 * @param {WebDriver} driver - The WebDriver instance
 * @param {string} selector - CSS selector for the element to click
 * @param {Function} condition - Condition to wait for after clicking
 * @param {number} timeout - Timeout in milliseconds
 */
async function clickAndWait(driver, selector, condition, timeout = 5000) {
  const element = await waitForElement(driver, selector);
  await element.click();
  await driver.wait(condition, timeout);
}

/**
 * Check if an element exists
 * @param {WebDriver} driver - The WebDriver instance
 * @param {string} selector - CSS selector for the element
 * @returns {Promise<boolean>} True if element exists
 */
async function elementExists(driver, selector) {
  try {
    await driver.findElement(By.css(selector));
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get all elements matching a selector
 * @param {WebDriver} driver - The WebDriver instance
 * @param {string} selector - CSS selector
 * @returns {Promise<Array<WebElement>>} Array of elements
 */
async function getAllElements(driver, selector) {
  return await driver.findElements(By.css(selector));
}

/**
 * Wait for a specific number of elements to be present
 * @param {WebDriver} driver - The WebDriver instance
 * @param {string} selector - CSS selector
 * @param {number} count - Expected number of elements
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForElementCount(driver, selector, count, timeout = 10000) {
  await driver.wait(async () => {
    const elements = await driver.findElements(By.css(selector));
    return elements.length === count;
  }, timeout);
}

module.exports = {
  waitForElement,
  waitForText,
  waitForPageLoad,
  takeScreenshot,
  clearAndType,
  clickAndWait,
  elementExists,
  getAllElements,
  waitForElementCount
}; 