# Euler Connect

A TikTok LIVE Chrome Extension for creating secure connections to TikTok LIVE Streams.

### First Steps

1. Request `connect.eulerstream.com/sessionId` **in a client context** on a browser page
2. Create a popup & connect to it (as shown below)

```js
// Set the unique id
const uniqueId = 'tv_asahi_news';

// Fetch the session id on the CLIENT SIDE in a browser page
const response = await fetch("https://connect.eulerstream.com/sessionId");
const responseJson = await response.json();
const sessionId = response.headers.get("x-euler-session-id");
const popupBaseUrl = response.headers.get("x-euler-popup-base-url");

// The extension should be installed
if (!(sessionId && popupBaseUrl)) {
  throw new Error("Extension is not installed!");
}

// Create a popup url & customize options
const popupUrl = new URL(popupBaseUrl + uniqueId)
popupUrl.searchParams.set("title", "Custom Title");
popupUrl.searchParams.set("theme", "light");

// Generate the popup page. 
// NOTE: You can *also* load it as an iframe directly in your page for better UX (if you can make sure not to re-render constantly)
window.open(
  popupUrl,
  "popupWindow",
  "width=340,height=280,toolbar=no,location=no,menubar=no,scrollBars=no"
);
```

