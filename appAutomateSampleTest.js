var wd = require('wd');
var assert = require('assert');
var asserters = wd.asserters;

// Defining multiple capabilities 
var capabilities1 = {
    "platformName" : "android",
    "platformVersion" : "10.0",
    "deviceName" : "Google Pixel 4",
    "app" : "WikiAPP2",
    'bstack:options' : {
    "projectName" : "appAutomateTest",
    "buildName" : "Build-2",
    "sessionName" : "sampleAppTest",
    "userName" : process.env.BROWSERSTACK_USERNAME,
    "accessKey" : process.env.BROWSERSTACK_ACCESS_KEY,
    },
    "browserName" : "chrome",
    }
var capabilities2 = {
	"platformName" : "android",
	"platformVersion" : "12.0",
	"deviceName" : "Samsung Galaxy S22",
	"app" : "WikiAPP2",
	'bstack:options' : {
		"projectName" : "appAutomateTest",
		"buildName" : "Build-2",
		"sessionName" : "sampleAppTest",
		"userName" : process.env.BROWSERSTACK_USERNAME,
        "accessKey" : process.env.BROWSERSTACK_ACCESS_KEY,
	},
}

  
async function runTestWithCaps (desiredCaps) {
  // Initializing the driver
  const driver = wd.promiseRemote("https://hub-cloud.browserstack.com/wd/hub");
  
  // Writing a test case
  driver
    .init(desiredCaps)
    .then(function () {
      return driver.waitForElementByAccessibilityId('Search Wikipedia', asserters.isDisplayed && asserters.isEnabled, 30000);
    })
    .then(function (searchElement) {
      return searchElement.click();
    })
    .then(function () {
      return driver.waitForElementById('org.wikipedia.alpha:id/search_src_text', asserters.isDisplayed && asserters.isEnabled, 30000);
    })
    .then(function (searchInput) {
      return searchInput.sendKeys("BrowserStack");
    })
    .then(function () {
      return driver.elementsByClassName('android.widget.TextView');   
    })
    .then(function (search_results) {
        if(search_results.length > 0){
            return driver.execute('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Results found!"}}');
          } else {
            driver.execute('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "No results available!"}}');
          
           }
    })
    .fin(function() { return driver.quit(); })
    .done();
}
  
// Calling defined capabilities in the 'runTestWithCaps' function
runTestWithCaps(capabilities1);
runTestWithCaps(capabilities2);