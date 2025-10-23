import { test, expect } from '@playwright/test';

// Basic smoke tests to ensure the app boots and core routes are available

test('home page loads and has correct title', async ({ page }) => {
  const res = await page.goto('/');
  expect(res).not.toBeNull();
  expect(res!.ok()).toBeTruthy();
  await expect(page).toHaveTitle(/Techmodule Shop/i);
});

const routes = ['/', '/login', '/register', '/cart', '/checkout'];

for (const route of routes) {
  test(`route ${route} is reachable`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res).not.toBeNull();
    expect(res!.ok()).toBeTruthy();
    await expect(page).toHaveURL(new RegExp(`${route.replace('/', '\\/')}$`));
  });
}


// 404-like route should redirect to home ('**' redirect configured)
test('unknown route redirects to home', async ({ page }) => {
  await page.goto('/some-totally-unknown-route');
  await expect(page).toHaveURL(/\/$/);
});
