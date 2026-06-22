import { Page, Locator } from "@playwright/test";

export class ProductPage {
  readonly page: Page;

  readonly productTitle: Locator;
  readonly addToBasketButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productTitle = page.locator("h1").first();
    this.addToBasketButton = page.locator(
      'button[data-testid="add-to-cart-button"]',
    );
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.productTitle.waitFor({ state: "visible", timeout: 10_000 });
      return true;
    } catch {
      return false;
    }
  }
}
