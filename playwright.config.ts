import {defineConfig} from '@playwright/test';
// PLAYWRIGHT_PORT lets the suite run beside a preview server that already holds the default port.
const port = Number(process.env.PLAYWRIGHT_PORT || 4173);
const baseURL = `http://127.0.0.1:${port}`;
export default defineConfig({
 testDir: './tests', fullyParallel: false, workers: 1, timeout: 30000,
 use: { baseURL, channel: process.env.CI ? undefined : 'chrome', trace:'retain-on-failure' },
 reporter: [['list'],['json',{outputFile:'artifacts/test-results.json'}]],
 webServer: {command:`npm run build && npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,url:baseURL,reuseExistingServer:!process.env.CI,timeout:120000},
});
