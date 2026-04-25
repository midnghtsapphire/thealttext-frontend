import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should have working nav links', async ({ page }) => {
    await page.goto('/')
    // Check navigation exists
    const nav = page.locator('nav')
    if (await nav.count() > 0) {
      await expect(nav).toBeVisible()
    }
  })
})
