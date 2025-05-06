import {readFileSync} from 'node:fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
const resourcePattern = ['*://*.tiktok.com/*', '*://*.eulerstream.com/*', '*://localhost/*'];

/**
 * @prop default_locale
 * if you want to support multiple languages, you can use the following reference
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
 *
 * @prop browser_specific_settings
 * Must be unique to your extension to upload to addons.mozilla.org
 * (you can delete if you only want a Chrome extension)
 *
 * @prop permissions
 * Firefox doesn't support sidePanel (It will be deleted in manifest parser)
 *
 * @prop content_scripts
 * css: ['content.css'], // public folder
 */
const manifest = {
  manifest_version: 3,
  default_locale: 'en',
  name: '__MSG_extensionName__',
  browser_specific_settings: {},
  version: packageJson.version,
  description: '__MSG_extensionDescription__',
  host_permissions: [...resourcePattern],
  permissions: [
    'storage',
    'tabs',
    'declarativeNetRequest'
  ],
  background: {
    service_worker: 'background.js',
    type: 'module',
  },
  action: {
    default_icon: 'icon-128.png'
  },
  icons: {
    128: 'icon-128.png',
  },
  content_scripts: [
    {
      matches: resourcePattern,
      js: ['content/index.iife.js'],
      run_at: 'document_end', // Run after document is fully loaded since we need document.body to wait on elements
      all_frames: true,
    },
    {
      matches: resourcePattern,
      css: ['content.css'],
      all_frames: true,
    }
  ],
  web_accessible_resources: [
    {
      resources: ['*.js', '*.css', '*.svg', '*.proto', 'icon-128.png', 'icon-34.png'],
      matches: resourcePattern,
    },
    {
      resources: ['*.js', '*.css', '*.svg', '*.proto', 'icon-128.png', 'icon-34.png', "*.html"],
      matches: ["<all_urls>"]
    }
  ]
} satisfies chrome.runtime.ManifestV3;

export default manifest;
