import { Page } from 'playwright';
import { capture } from '../utils/capture';
import { CONFIG } from '../config';

const BASE_URL = CONFIG.BASE_URL;

export async function runPcScenarios(page: Page): Promise<void> {
  // home-pc
  try {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    await capture(page, 'home-pc', 'pc');
  } catch (e) {
    console.error('❌ home-pc failed:', e);
  }

  // post-detail-pc: navigate to first post
  try {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    const firstPostLink = page.locator('a[href^="/posts/"]').first();
    await firstPostLink.click({ timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await capture(page, 'post-detail-pc', 'pc');
  } catch (e) {
    console.error('❌ post-detail-pc failed:', e);
  }

  // about-pc
  try {
    await page.goto(`${BASE_URL}/about`);
    await page.waitForLoadState('networkidle');
    await capture(page, 'about-pc', 'pc');
  } catch (e) {
    console.error('❌ about-pc failed:', e);
  }
}

export async function runMobileScenarios(page: Page): Promise<void> {
  // home-mobile
  try {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    await capture(page, 'home-mobile', 'mobile');
  } catch (e) {
    console.error('❌ home-mobile failed:', e);
  }

  // post-detail-mobile: navigate to first post
  try {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    const firstPostLink = page.locator('a[href^="/posts/"]').first();
    await firstPostLink.click({ timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await capture(page, 'post-detail-mobile', 'mobile');
  } catch (e) {
    console.error('❌ post-detail-mobile failed:', e);
  }

  // about-mobile
  try {
    await page.goto(`${BASE_URL}/about`);
    await page.waitForLoadState('networkidle');
    await capture(page, 'about-mobile', 'mobile');
  } catch (e) {
    console.error('❌ about-mobile failed:', e);
  }
}
