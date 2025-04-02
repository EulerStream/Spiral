import Logger from "@extension/shared/lib/logger";

type Rule = chrome.declarativeNetRequest.Rule;
const ResourceType = chrome.declarativeNetRequest.ResourceType;
const RuleActionType = chrome.declarativeNetRequest.RuleActionType;
const HeaderOperation = chrome.declarativeNetRequest.HeaderOperation;
type HttpHeader = chrome.webRequest.HttpHeader;

const IFRAME_HOSTS = ['tiktok.com', '*.tiktok.com'];
const EXTRA_FRAME_SOURCES = ['ws://spiral.eulerstream.com'];

/** Exposing localhost is a security risk. Only add it when in development mode. */
if (chrome.runtime.getManifest().name.includes('Development')) {
  EXTRA_FRAME_SOURCES.push("ws://localhost:8081", "ws://127.0.0.1:8081", "ws://localhost:8000", "ws://127.0.0.1:8000");
}


function createModifiedXFrameOptionsRule(): Rule {
  return {
    id: 2,
    condition: {
      requestDomains: IFRAME_HOSTS,
      resourceTypes: [ResourceType.MAIN_FRAME, ResourceType.SUB_FRAME, ResourceType.SCRIPT],
    },
    action: {
      type: RuleActionType.MODIFY_HEADERS,
      responseHeaders: [
        {
          header: 'x-frame-options',
          operation: HeaderOperation.REMOVE
        },
      ],
    },
  }

}

/** Rather than overriding the CSP naively, we dynamically set it to maintain browser security. */
function createModifiedCspRule(): Rule {

  Logger.info("Overriding TikTok CSP Header");

  // Return the new rule
  return {
    id: 1,
    condition: {
      requestDomains: IFRAME_HOSTS,
      resourceTypes: [ResourceType.MAIN_FRAME, ResourceType.SUB_FRAME, ResourceType.SCRIPT],
    },
    action: {
      type: RuleActionType.MODIFY_HEADERS,
      responseHeaders: [
        {
          header: 'content-security-policy',
          operation: HeaderOperation.REMOVE,
        },
      ],
    },
  }
}


/** Update the CSP rule with the new CSP header. */
function updateCspRule() {
  const cspRule: Rule = createModifiedCspRule();
  const xFrameOptionsRule: Rule = createModifiedXFrameOptionsRule();

  return chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [cspRule.id, xFrameOptionsRule.id],
    addRules: [cspRule, xFrameOptionsRule]
  });

}

/** When we receive the initial headers from www.tiktok.com, we can modify the rule. */
export default function AddModifyCspRule() {
  updateCspRule().then(() => {
    Logger.info("Successfully updated CSP Rule");
  });

  const onHeadersReceived = (details: chrome.webRequest.WebResponseHeadersDetails) => {
    const responseHeaders = details.responseHeaders || [];
    const contentTypeHeader = responseHeaders.find(header => header.name.toLowerCase() === 'content-type');

    // Only modify the CSP if the content is HTML
    if (!contentTypeHeader?.value?.includes('text/html')) {
      return;
    }

    const cspHeader = responseHeaders.find(header => header.name.toLowerCase() === 'content-security-policy');
  }

  chrome.webRequest.onHeadersReceived.addListener(
      onHeadersReceived,
      {urls: ["*://*.tiktok.com/*"], types: ["main_frame", "sub_frame"]},
      ['responseHeaders']
  );

}



