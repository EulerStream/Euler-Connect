import {HeaderOperation, ResourceType, Rule, RuleActionType,} from "@src/types/chrome";
import Logger from "@extension/shared/lib/logger";
import {settingStorage} from "@extension/storage";

export const RESOURCE_TYPES = [
  ResourceType.MAIN_FRAME,
  ResourceType.SUB_FRAME,
  ResourceType.XMLHTTPREQUEST,
  ResourceType.SCRIPT,
]

const STATIC_RULES: Rule[] = [
  {
    id: 1,
    condition: {urlFilter: `*tiktok.com/*`, resourceTypes: RESOURCE_TYPES},
    action: {
      type: RuleActionType.MODIFY_HEADERS,
      responseHeaders: [
        {
          header: 'x-frame-options',
          operation: HeaderOperation.REMOVE
        },
        {
          header: 'content-security-policy',
          operation: HeaderOperation.SET,
          value: "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
        }
      ],
    },
  }
]


async function updateRules() {
  const {sessionId, customServerUrl, customServerEnabled} = await settingStorage.get()
  const serverUrl = (customServerEnabled && !!customServerUrl) ? customServerUrl : import.meta.env.VITE_PUBLIC_PUSH_SERVER_URL;
  const serverUrlDomain = new URL(serverUrl).hostname

  const rules: Rule[] = [
    ...STATIC_RULES,
    {
      id: STATIC_RULES.length + 1,
      condition: {requestDomains: [serverUrlDomain], resourceTypes: RESOURCE_TYPES},
      action: {
        type: RuleActionType.MODIFY_HEADERS,
        responseHeaders: [
          {
            header: 'x-euler-session-id',
            operation: HeaderOperation.SET,
            value: sessionId
          },
          {
            header: 'x-euler-popup-base-url',
            operation: HeaderOperation.SET,
            value: `chrome-extension://${chrome.runtime.id}/dashboard/index.html#popup/`
          }
        ]
      }
    }
  ]

  await chrome.declarativeNetRequest.updateDynamicRules(
      {
        removeRuleIds: Array.from({length: rules.length + 1000}, (_, i) => i),
        addRules: rules
      }
  )
}

settingStorage.subscribe(async () => {
  await updateRules()
  Logger.info("declarativeNetRequest rules updated!");
});
