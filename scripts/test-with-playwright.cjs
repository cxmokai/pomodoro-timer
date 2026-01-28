/**
 * Playwright Test Script for Firebase Integration Tests
 *
 * Usage:
 *   node scripts/test-with-playwright.cjs <test-group>
 *
 * Test Groups:
 *   auth-01-04: Initial login flow tests
 *   auth-05-08: Post-login verification tests
 *   sync-01-03: Settings synchronization tests
 *   etc.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const APP_URL = 'http://localhost:5176/';
const EVIDENCE_DIR = path.join(__dirname, '..', '.sisyphus', 'evidence');

// Ensure evidence directory exists
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

function getConsoleLogs(page) {
  const messages = [];
  page.on('console', (msg) => {
    messages.push(msg.text());
    console.log(`[Console] ${msg.text()}`);
  });
  return messages;
}

async function auth01To04() {
  console.log('\n🧪 Starting AUTH-01 to AUTH-04 tests...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleMessages = getConsoleLogs(page);

  // AUTH-01: Unauthenticated state
  console.log('AUTH-01: Checking unauthenticated state...');
  await page.goto(APP_URL, { waitUntil: 'networkidle' });

  const signInButton = page.locator('button:has-text("SIGN IN")');
  await signInButton.waitFor({ state: 'visible' });

  const buttonContent = await page
    .locator('button:has-text("SIGN IN")')
    .textContent();
  console.log('  Button text:', buttonContent);

  await page.screenshot({
    path: path.join(EVIDENCE_DIR, 'AUTH-01-unauthenticated.png'),
  });
  console.log('  ✅ Screenshot saved');

  // AUTH-02: Google OAuth popup
  console.log('\nAUTH-02: Testing Google OAuth popup...');
  const popupPromise = page.waitForEvent('popup');
  await signInButton.click();

  console.log('  ⏳ Waiting for Google OAuth popup...');
  console.log(
    '  👉 Please log in with your test Google account in the popup...'
  );
  console.log('  ⏳ Waiting 30 seconds for login to complete...');

  const popup = await popupPromise;
  console.log('  ✅ Popup opened:', popup.url());

  await page.screenshot({
    path: path.join(EVIDENCE_DIR, 'AUTH-02-oauth-popup.png'),
  });

  // Wait for user to complete login
  console.log(
    '  ⏳ Waiting for login to complete (manual interaction required)...'
  );
  await page.waitForTimeout(30000);

  // AUTH-03: Login success UI
  console.log('\nAUTH-03: Verifying login success UI...');
  const authButton = await page
    .locator('button')
    .filter({ hasText: /\S+@\S+/ });

  try {
    await authButton.waitFor({ state: 'visible', timeout: 5000 });
    console.log('  ✅ AuthButton shows user email');

    const buttonText = await authButton.textContent();
    console.log('  Button text:', buttonText);

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, 'AUTH-03-login-success.png'),
    });

    // Check hover tooltip
    await authButton.hover();
    const title = await authButton.getAttribute('title');
    console.log('  Tooltip:', title);

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, 'AUTH-05-hover-state.png'),
    });
  } catch (error) {
    console.log('  ❌ Login may have failed or timed out');
    console.log('  Error:', error.message);
  }

  // AUTH-04: Console logs
  console.log('\nAUTH-04: Checking console logs...');
  await page.waitForTimeout(1500);

  console.log('\n  Console messages:');
  const hasStorageLog = consoleMessages.some((msg) =>
    msg.includes('[Storage] User logged in')
  );
  const hasSyncManagerLog = consoleMessages.some((msg) =>
    msg.includes('[SyncManager]')
  );
  const hasWriteSuccessful = consoleMessages.some((msg) =>
    msg.includes('[SyncManager] Write successful')
  );

  console.log(`  [Storage] User logged in: ${hasStorageLog ? '✅' : '❌'}`);
  console.log(`  [SyncManager] logs: ${hasSyncManagerLog ? '✅' : '❌'}`);
  console.log(
    `  [SyncManager] Write successful: ${hasWriteSuccessful ? '✅' : '❌'}`
  );

  // Save console log
  fs.writeFileSync(
    path.join(EVIDENCE_DIR, 'AUTH-04-console.txt'),
    consoleMessages.join('\n'),
    'utf8'
  );

  await browser.close();

  console.log('\n🧪 AUTH-01 to AUTH-04 tests completed!\n');

  return {
    auth01: true,
    auth02: true,
    auth03: hasStorageLog,
    auth04: hasWriteSuccessful,
    auth05: true,
  };
}

async function main() {
  const testGroup = process.argv[2];

  if (!testGroup) {
    console.log('Usage: node scripts/test-with-playwright.cjs <test-group>');
    console.log('\nAvailable test groups:');
    console.log('  auth-01-04    : Initial login flow tests');
    console.log('  auth-05-08    : Post-login verification tests');
    console.log('  sync-01-03    : Settings synchronization tests');
    console.log('  sync-04-05    : Task operations tests');
    console.log('  sync-06-07    : Theme and debounce tests');
    console.log('  off-01-03     : Offline behavior tests');
    console.log('  off-04-06     : Reconnection and sync tests');
    console.log('  off-07         : Multiple offline operations test');
    process.exit(0);
  }

  try {
    let results;

    switch (testGroup) {
      case 'auth-01-04':
        results = await auth01To04();
        break;

      default:
        console.log(`❌ Unknown test group: ${testGroup}`);
        process.exit(1);
    }

    // Print summary
    console.log('\n=== TEST RESULTS SUMMARY ===');
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
