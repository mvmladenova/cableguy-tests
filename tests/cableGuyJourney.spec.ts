import { test, expect } from "@playwright/test";
import { CableGuyPage } from "../pages/CableGuyPage";
import { ProductPage } from "../pages/ProductPage";
import { BasketPage } from "../pages/BasketPage";

test.describe("Cable Guy – Core Configuration Journey", () => {
  test.beforeEach(async ({ page }) => {
    const cableGuy = new CableGuyPage(page);
    await cableGuy.goto();
    await cableGuy.dismissCookieBanner();
  });

  test("user can configure BNC female → BNC male and open a product page", async ({
    page,
  }) => {
    const cableGuy = new CableGuyPage(page);
    const productPage = new ProductPage(page);

    // Step 1: Verify page loads with results
    const initialCount = await cableGuy.getResultsCount();
    expect(initialCount).toMatch(/\d+ cables found/i);

    // Step 2: Select cable beginning
    await cableGuy.selectConnector("beginning", "BNC female");

    // Step 3: Select cable end
    await cableGuy.selectConnector("end", "BNC male");

    // Step 4: Verify results are filtered and non-zero
    const filteredCount = await cableGuy.getResultsCount();
    const count = parseInt(filteredCount.match(/(\d+)/)?.[1] ?? "0", 10);
    expect(count).toBeGreaterThan(0);

    // Step 5: Open first product
    await cableGuy.openFirstProduct();

    // Step 6: Verify product page loaded
    const loaded = await productPage.isLoaded();
    expect(loaded).toBe(true);

    await expect(productPage.productTitle).toBeVisible();
    await expect(productPage.addToBasketButton).toBeVisible();

    // Step 7: Add to basket and verify redirect to basket page
    await productPage.addToBasketButton.click();
    const basket = new BasketPage(page);
    const basketLoaded = await basket.isLoaded();
    expect(basketLoaded).toBe(true);
    expect(await basket.basketItem.count()).toBeGreaterThan(0);

    // Step 8: Remove item and verify basket is empty
    await basket.removeFirstItem();
    await expect(basket.emptyBasketImage).toBeVisible();
  });

  test("reset clears all filters and restores full results", async ({
    page,
  }) => {
    const cableGuy = new CableGuyPage(page);

    // Get initial count
    const initialCount = await cableGuy.getResultsCount();
    const initial = parseInt(initialCount.match(/(\d+)/)?.[1] ?? "0", 10);

    // Select a connector to filter results
    await cableGuy.selectConnector("beginning", "BNC female");
    const filteredCount = await cableGuy.getResultsCount();
    const filtered = parseInt(filteredCount.match(/(\d+)/)?.[1] ?? "0", 10);

    // Filtered should be less than initial
    expect(filtered).toBeLessThan(initial);

    // Reset and verify count is back to full catalogue (greater than filtered)
    await cableGuy.resetButton.click();
    const afterReset = await cableGuy.getResultsCount();
    const reset = parseInt(afterReset.match(/(\d+)/)?.[1] ?? "0", 10);
    expect(reset).toBeGreaterThan(filtered);
  });
});
