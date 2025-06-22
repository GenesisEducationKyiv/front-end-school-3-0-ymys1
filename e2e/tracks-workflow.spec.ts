import { test, expect } from '@playwright/test';

test.describe('Tracks Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display tracks page', async ({ page }) => {
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should display add track button', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /add track/i });
    await expect(addButton).toBeVisible();
  });
}); 