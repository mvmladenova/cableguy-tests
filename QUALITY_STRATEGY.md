## Main Product Risks

### High

- **Connector selection breaks filtering** – If selecting a connector type fails to filter results correctly, users cannot find a suitable cable. This directly impacts conversion.
- **Zero results with valid combination** – A valid connector pair returns no results due to a filtering bug or data issue. User hits a dead end.
- **Product page unreachable** – Clicking a product from the results list fails to navigate correctly.
- **Add to Basket non-functional** – The final step toward purchase is broken.

### Medium

- **Reset does not restore full results** – User is stuck with a narrowed selection they cannot clear.
- **Dynamic filter counts incorrect** – Result totals are stale or wrong after selection.
- **Connector modal does not close** – After selecting a connector, the modal stays open and blocks interaction.

### Low

- **Price/length sliders not updating results** – Secondary filters that affect result set but do not block the journey.
- **Sort order not working** – Cosmetic impact, does not block purchase flow.
- **Colour swatches not filtering** – Low business impact for most cable types.

## Most Important User Flows

1. Select Cable Beginning → Select Cable End → View filtered results → Open product → Add to Basket → Verify basket → Remove item *(core happy path)*
2. Select Cable Beginning only → Browse filtered results *(partial configuration)*
3. Apply multiple filters → Verify combined results are correct
4. Reset all filters → Verify full catalogue restored

## What to Automate

| Flow | Reason |
|---|---|
| Core happy path (beginning + end → product page → basket → cleanup) | Highest business value, runs on every deployment |
| Reset restores full results | Guards against filter state bugs |
| Filtered count is less than unfiltered count | Validates dynamic filtering works |
| Product page renders h1 + Add to Basket | Guards final conversion step |
| Basket contains item after Add to Basket | Verifies purchase flow is not broken |
| Basket is empty after item removal | Verifies cleanup and basket state |

## What NOT to Automate

| Flow | Reason |
|---|---|
| All connector combinations | 50+ connector types × combinations = combinatorial explosion; no stable ROI |
| Price/length slider interaction | Range sliders are fragile in Playwright without pixel-level drag; better covered by manual or visual testing |
| Colour filter | Low business impact; visual check is more appropriate |
| Sort order | No clear assertion beyond order of elements; flake-prone |
| Full checkout flow | Requires authenticated session and payment state; out of scope |

## Assumptions and Open Questions

- **Assumption:** BNC female → BNC male is a stable connector combination with consistently more than 0 results. Validated manually.
- **Assumption:** The `/intl/cableguy.html` URL is stable and does not require authentication.
- **Assumption:** Add to Basket on product details page redirects directly to basket — confirmed through manual testing.
- **Open question:** Are connector names in the modal stable across deployments, or could they change? If so, selectors should be data-attribute based rather than text-based.
- **Open question:** Does the cookie banner always appear on a fresh browser context? Current implementation handles both cases defensively.
- **Open question:** Is there a test environment available? Tests run against production, which means live product availability affects results.