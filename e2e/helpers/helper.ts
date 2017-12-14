import { browser, by, element, ElementArrayFinder, ElementFinder, ExpectedConditions as EC } from 'protractor';

import { CommonChartPage } from '../pages/common-chart.po';

const MAX_TIMEOUT = 30000;
const TIMEOUT = 15000;

export function waitForPageLoaded() {
  return browser.wait(EC.visibilityOf(CommonChartPage.sideBar), MAX_TIMEOUT)
    .then(() => browser.wait(EC.visibilityOf(CommonChartPage.mainChart), MAX_TIMEOUT))
    .then(() => browser.wait(EC.visibilityOf(CommonChartPage.buttonPlay), MAX_TIMEOUT))
    .then(() => browser.wait(EC.visibilityOf(CommonChartPage.sliderReady), MAX_TIMEOUT));
}

export function waitForSpinner() {
  // return browser.wait(EC.visibilityOf(CommonChartPage.spinner), 3000, 'spinner to be visible').then(() => {
  return browser.wait(EC.stalenessOf(CommonChartPage.spinner), TIMEOUT, 'stalenessOf of spinner');
  // });
}

export function safeDragAndDrop(from: ElementFinder, to: any) {
  return browser.wait(EC.visibilityOf(from), TIMEOUT, `element ${from.locator().value} not visible`)
    .then(() => disableAnimations())
    .then(() => browser.actions().dragAndDrop(from, to).perform());
}

export function safeExpectIsDispayed(element: ElementFinder, interval?: number) {
  const timeout = interval || TIMEOUT;

  return browser.wait(EC.visibilityOf(element), timeout, `element ${element.locator().value} is not visible in ${timeout} ms`);
}

export function findElementByExactText(cssSelector: ElementFinder | ElementArrayFinder, searchText: string): ElementFinder {

  return element.all(by.cssContainingText(cssSelector.locator().value, searchText)).filter(element => {
    return element.getText().then(text => {
      return text === searchText;
    });
  }).first();
}

export function waitForSliderToBeReady() {
  return browser.wait(EC.visibilityOf(CommonChartPage.sliderReady), MAX_TIMEOUT);
}

export async function waitForUrlToChange() {
  const currentUrl = await browser.getCurrentUrl();

  return browser.wait(() => {
    return browser.getCurrentUrl().then(url => {
      return url !== currentUrl;
    });
  }, MAX_TIMEOUT, 'URL not changed');
}

export function isCountryAddedInUrl(country: string, state = true): Function {
  /**
   * if state = true use it to wait for presence string in url
   * otherwise, use to wait for string to be removed from URL
   */

  if (state) {
    return () => {
      return browser.getCurrentUrl().then(url => {
        return url.includes(`=${CommonChartPage.countries[country]}`);
      });
    };
  } else {
    return () => {
      return browser.getCurrentUrl().then(url => {
        return !url.includes(`=${CommonChartPage.countries[country]}`);
      });
    };
  }
}

export function disableAnimations() {
  return browser.executeScript(`var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '* {' +
    '-webkit-transition: none !important;' +
    '-moz-transition: none !important' +
    '-o-transition: none !important' +
    '-ms-transition: none !important' +
    'transition: none !important' +
    '}';
  document.getElementsByTagName('head')[0].appendChild(style);`)
}