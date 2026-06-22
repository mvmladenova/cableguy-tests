# Investigation Notes

## Why This Scenario

The BNC female → BNC male combination was chosen because:

1. Both connector types are present in the first visible row of the modal without scrolling, reducing interaction complexity.
2. The combination yields a small but consistent number of results, making assertions stable.
3. The full journey from configuration to basket cleanup can be completed without authentication or external dependencies.
4. BNC cables are a real use case for Thomann's core customer base — broadcast and studio equipment connections.

## Where the Test Could Become Flaky

### 1. Connector modal selectors

The modal uses text-based connector labels. If Thomann renames a connector the selector breaks silently. Mitigation: used `div.cg-plugItem` as the clickable container with `hasText` matching on the connector name. Clicking the whole card mirrors real user behaviour and is more stable than clicking the text label directly. If Thomann renames a connector label, the selector will break — this is a known risk documented as an open question.

### 2. Dynamic results count

The results count depends on live product availability. Mitigation: assertions check relative values (filtered < initial, reset > filtered) rather than exact numbers.

### 3. Cookie banner timing

The banner appears asynchronously. Mitigation: wrapped in try/catch with a 5s timeout — the test continues whether or not the banner appears.

### 4. span.cg-count async update

After connector selection, `span.cg-count` is visible immediately but its text updates asynchronously. Reading it too early returns an empty string or a stale value. Mitigation: added `expect(resultsCount).not.toHaveText('')` which retries automatically until the text is populated.

### 5. Reset count exact match

Initial implementation used `toBe(initialCount)` after reset — this failed because Thomann's live catalogue changes between test runs (3294 vs 3292 cables). Mitigation: replaced with `toBeGreaterThan(filtered)` which tests the behaviour, not the exact number.

## What I Would Improve With More Time

1. **Inspect all selectors against live DOM** — verify every selector with DevTools before finalising.
2. **Add a zero-results state test** — select an incompatible connector combination and assert a "no cables found" message appears.
3. **Extract cookie dismissal into a fixture** — runs automatically as a `beforeAll` hook per worker instead of per test.
4. **API-level validation** — if a filtering API endpoint exists, add a lightweight API test to verify correct product IDs are returned for a known connector pair.
5. **Visual regression test** — the Cable Guy widget has distinct visual states that functional tests miss.

## Live Website Observations

- Cookie banner ("Served with love!") appears on every fresh browser context.
- With no connectors selected, ~3283 cables are shown (number changes daily).
- BNC female + BNC male returns approximately 8 results — stable enough for assertions.
- Add to Basket on the product details page redirects directly to the basket page — no notification banner, full page navigation.
- The reset button is disabled when no connectors are selected and becomes active after selection.

## Bug Reports / Observations

### UI Inconsistency: Inconsistent Add to Basket behaviour

**Observed:** Adding a product to the basket from the product list (PLP) shows
a notification banner and keeps the user on the same page. Adding from the
product detail page (PDP) redirects the user directly to the basket page with
no option to continue browsing.

**Impact:** Medium — users who want to add multiple cables and compare options
are interrupted by the redirect from PDP. The inconsistency may cause confusion.

**Status:** Observed during manual testing. Not confirmed as a defect —
may be intentional product decision.
