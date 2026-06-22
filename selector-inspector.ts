/**
 * Selector Inspector
 *
 * Utility script used during initial exploration to identify stable DOM selectors
 * for the Cable Guy configurator. Run manually against the live site to inspect
 * element classes, attributes, and structure before writing the Page Objects.
 *
 * Usage: npx ts-node selector-inspector.ts
 */

import { chromium } from "@playwright/test";

async function inspectSelectors() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.thomann.de/intl/cableguy.html");

  console.log("\nDismiss cookie banner, then press Enter...");
  await new Promise((resolve) => process.stdin.once("data", resolve));

  // Cookie banner бутон
  const cookieHTML = await page
    .$eval("button", (el) => el.outerHTML)
    .catch(() => "not found");
  console.log("\n--- COOKIE BUTTON ---");
  console.log(cookieHTML);

  // Cable Beginning slot
  const beginningHTML = await page.$$eval(
    '[class*="cg-slot"], [class*="cg-connector"], [class*="cg-plug"][class*="slot"], [class*="cg-add"]',
    (els) =>
      els.map((el) => ({
        class: el.className,
        html: el.outerHTML.slice(0, 200),
      })),
  );
  console.log("\n--- CABLE BEGINNING/END SLOTS ---");
  console.log(JSON.stringify(beginningHTML, null, 2));

  // Reset link
  const resetHTML = await page
    .$eval("a", (el) => el.outerHTML)
    .catch(() => "not found");
  console.log("\n--- FIRST LINK (reset candidate) ---");
  console.log(resetHTML);

  console.log("\nNow click Cable Beginning, then press Enter...");
  await new Promise((resolve) => process.stdin.once("data", resolve));

  // Modal wrapper след клик
  const modalHTML = await page.$$eval(
    '[class*="cg-modal"], [class*="cg-overlay"], [class*="cg-dialog"], [role="dialog"]',
    (els) =>
      els.map((el) => ({
        class: el.className,
        html: el.outerHTML.slice(0, 300),
      })),
  );
  console.log("\n--- MODAL ---");
  console.log(JSON.stringify(modalHTML, null, 2));

  // Search field в modal-а
  const searchHTML = await page
    .$eval("input", (el) => el.outerHTML)
    .catch(() => "not found");
  console.log("\n--- SEARCH INPUT ---");
  console.log(searchHTML);

  // First product link в резултатите
  console.log("\nClose modal (press Escape), then press Enter...");
  await new Promise((resolve) => process.stdin.once("data", resolve));

  const productLinks = await page.$$eval(
    '[class*="cg-product"] a, [class*="product"] a, [class*="fx-productList"] a',
    (els) =>
      els.slice(0, 3).map((el) => ({
        class: el.className,
        href: el.getAttribute("href"),
        html: el.outerHTML.slice(0, 200),
      })),
  );
  console.log("\n--- PRODUCT LINKS ---");
  console.log(JSON.stringify(productLinks, null, 2));

  await browser.close();
}

inspectSelectors();
