import { chromium } from 'playwright';
import { CONFIG } from './config';
import { runPcScenarios, runMobileScenarios } from './scenarios/index';

async function main() {
  const browser = await chromium.launch({ headless: true });

  // PC context (no auth needed)
  const pcContext = await browser.newContext({
    viewport: CONFIG.VIEWPORTS.pc,
    deviceScaleFactor: CONFIG.DEVICE_SCALE_FACTOR,
  });
  const pcPage = await pcContext.newPage();
  await runPcScenarios(pcPage);
  await pcContext.close();

  // Mobile context (no auth needed)
  const mobileContext = await browser.newContext({
    viewport: CONFIG.VIEWPORTS.mobile,
    deviceScaleFactor: CONFIG.DEVICE_SCALE_FACTOR,
  });
  const mobilePage = await mobileContext.newPage();
  await runMobileScenarios(mobilePage);
  await mobileContext.close();

  await browser.close();
  console.log('Done! Screenshots saved to', CONFIG.OUTPUT_DIR);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
