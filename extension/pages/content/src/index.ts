import Logger from "@extension/shared/lib/logger";
import {querySelectorWait} from "@src/modules/chrome";
import {ContentMessageProxy, ProxyEvent} from "@extension/message-proxy";
import {PushClient} from "@src/modules/push-client";

/** Only Load on TikTok LIVE Page **/
if (window.location.pathname.match(/@[a-zA-Z0-9._]{1,24}\/live/g)) {
  document.__Content__ = {MessageProxy: new ContentMessageProxy(), PushClient: new PushClient(), Username: ''}
  Object.defineProperty(document.__Content__, 'Username', {get: () => window.location.pathname.split('/')[1]?.slice(1) || ''});
  querySelectorWait("#tiktok-live-main-container-id", 30 * 1000, 1000).then(onLoad);
}

/** Inject the script into the page **/
async function onLoad() {
  Logger.info("Injecting injected script!");
  const injectScript = document.createElement("script");
  injectScript.src = chrome.runtime.getURL("content-injected/index.iife.js");
  injectScript.onload = () => injectScript.remove();
  (document.head || document.documentElement).appendChild(injectScript);
  await document.__Content__.PushClient.start();
  document.__Content__.MessageProxy.on(ProxyEvent.RESET_SESSION_ID, () => window.location.reload());
}