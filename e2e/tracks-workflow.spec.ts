import { test, expect } from '@playwright/test';

test.describe('Tracks Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open create track dialog', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /add track/i });
    await addButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Create New Track');

    await expect(page.getByLabel('Title')).toBeVisible();
    await expect(page.getByLabel('Artist')).toBeVisible();

    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(dialog).not.toBeVisible();
  });
});
