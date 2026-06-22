import { Page, Locator, expect } from "@playwright/test";

export class BasketPage {
  readonly page: Page;

  readonly basketEntryList: Locator;
  readonly basketItem: Locator;
  readonly deleteButton: Locator;
  readonly emptyBasketImage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.basketEntryList = page.locator('[data-testid="basket-entry-list"]');
    this.basketItem = page.locator(".basket-entry.article-basket-entry");
    this.deleteButton = page.locator('[aria-label="remove item"]').first();
    this.emptyBasketImage = page.locator('img[alt="empty-cart"]');
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.basketEntryList.waitFor({ state: "visible", timeout: 10_000 });
      return true;
    } catch {
      return false;
    }
  }

  async removeFirstItem(): Promise<void> {
    await this.deleteButton.waitFor({ state: "visible" });
    await this.deleteButton.click();
    await this.emptyBasketImage.waitFor({ state: "visible", timeout: 10_000 });
  }
}
