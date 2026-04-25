import { test, expect } from '@playwright/test'

test.describe('Pricing Page', () => {
  test('should load pricing page', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.locator('body')).toBeVisible()
  })
})
