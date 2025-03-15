import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));
const devMode = process.env.__DEV__ === 'true';

const resourcePattern = ['*://*.tiktok.com/*', '*://*.eulerstream.com/*'];

if (devMode) {
  resourcePattern.push('*://localhost/*');
}

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  default_locale: 'en',
  name: 'Spiral' + (devMode ? ' (Development)' : ''),
  version: packageJson.version,
  description: 'Elevate your TikTok LIVE creator experience with high quality TikTok integrations.',
  host_permissions: resourcePattern,
  permissions: [
    'storage',
    'scripting',
    'tabs',
    'notifications',
    'declarativeNetRequest',
    'webRequest',
    'cookies'
  ],
  background: {
    service_worker: 'background.iife.js',
    type: 'module',
  },
  action: {
    default_icon: 'icon-34.png',
  },
  icons: {
    128: 'icon-128.png',
  },
  content_scripts: [
    {
      matches: resourcePattern,
      js: ['content/index.iife.js'],
      run_at: 'document_start',
      all_frames: true,
    },
    {
      matches: resourcePattern,
      js: ['content-ui/index.iife.js'],
      all_frames: true,

    },
    {
      matches: resourcePattern,
      css: ['content.css'],
      all_frames: true,

    },
  ],
  web_accessible_resources: [
    {
      resources: ['*.js', '*.css', '*.svg', '*.proto', 'icon-128.png', 'icon-34.png'],
      matches: resourcePattern,
    },
    // Local extension page
    {
      resources: ['dashboard/index.html'],
      matches: resourcePattern,
    }
  ]
};

export default manifest;