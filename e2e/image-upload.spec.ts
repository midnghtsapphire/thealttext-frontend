import { test, expect } from '@playwright/test'

test.describe('Image Upload', () => {
  test('should show upload component', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Upload')).toBeVisible()
  })
})
