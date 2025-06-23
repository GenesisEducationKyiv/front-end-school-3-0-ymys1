import { test, expect } from '@playwright/test';

test.describe('Filter Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should filter tracks by search', async ({ page }) => {

    await expect(page.locator('[data-testid^="track-item-"]')).toBeVisible();

    const initialTracks = await page.locator('[data-testid^="track-item-"]').count();
    
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('rock');

    await page.waitForTimeout(500);
    const filteredTracks = await page.locator('[data-testid^="track-item-"]').count();
    
    expect(filteredTracks).toBeLessThanOrEqual(initialTracks);
    
    await searchInput.clear();
    await page.waitForTimeout(500);
    const clearedTracks = await page.locator('[data-testid^="track-item-"]').count();
    expect(clearedTracks).toEqual(initialTracks);
  });
});
