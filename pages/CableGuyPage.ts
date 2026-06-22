import { Page, Locator, expect } from "@playwright/test";

export class CableGuyPage {
  readonly page: Page;

  readonly acceptCookiesButton: Locator;
  readonly cableBeginningSlot: Locator;
  readonly cableEndSlot: Locator;
  readonly connectorModal: Locator;
  readonly connectorSearch: Locator;
  readonly resultsCount: Locator;
  readonly firstProductLink: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.acceptCookiesButton = page.locator('button:has-text("Alright!")');
    this.cableBeginningSlot = page.locator(
      'button.cg-plugButton:has-text("cable beginning")',
    );
    this.cableEndSlot = page.locator(
      'button.cg-plugButton:has-text("cable end")',
    );
    this.connectorModal = page.locator("div.cg-plugmodal");
    this.connectorSearch = page.locator("input.cg-plugmodal__search__input");
    this.resultsCount = page.locator("span.cg-count");
    this.firstProductLink = page.locator("a.product__content").first();
    this.resetButton = page.locator("button.cg-reset");
  }

  async goto() {
    await this.page.goto("/intl/cableguy.html");
  }

  async dismissCookieBanner() {
    try {
      await this.acceptCookiesButton.waitFor({
        state: "visible",
        timeout: 5_000,
      });
      await this.acceptCookiesButton.click();
      await this.acceptCookiesButton.waitFor({
        state: "hidden",
        timeout: 5_000,
      });
    } catch {
      // Banner may not appear on every run
    }
  }

  async selectConnector(slot: "beginning" | "end", connectorName: string) {
    const slotLocator =
      slot === "beginning" ? this.cableBeginningSlot : this.cableEndSlot;
    await slotLocator.click();
    await this.connectorModal.waitFor({ state: "visible" });
    await this.connectorSearch.fill(connectorName);
    await this.page
      .locator("div.cg-plugItem", { hasText: connectorName })
      .first()
      .click();
    await this.connectorModal.waitFor({ state: "hidden" });
  }

  async getResultsCount(): Promise<string> {
    await this.resultsCount.waitFor({ state: "visible" });
    await expect(this.resultsCount).not.toHaveText("");
    return await this.resultsCount.innerText();
  }

  async openFirstProduct() {
    await this.firstProductLink.waitFor({ state: "visible" });
    await this.firstProductLink.click();
  }
}
