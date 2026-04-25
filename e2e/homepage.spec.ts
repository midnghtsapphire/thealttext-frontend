import { test, expect } from '@playwright/test'

test.describe('TheAltText Homepage', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
  })
})
