import 'webextension-polyfill';
import '@src/background/rules';

chrome.action.onClicked.addListener(() => {
  return chrome.tabs.create({url: chrome.runtime.getURL("/dashboard/index.html")})
});