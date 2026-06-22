# Cable Guy – Playwright Test Suite

Automated quality engineering solution for the Cable Guy configurator on thomann.de.

## Requirements

- Node.js 18+
- npm

## Installation

```bash
npm install
npx playwright install chromium
```

## Running the Tests

```bash
# Run all tests (headless)
npm test

# Run with visible browser
npm run test:headed

# Open HTML report after run
npm run report
```

## Project Structure

cableguy-tests/

├── pages/

│ ├── CableGuyPage.ts # Page Object for the Cable Guy configurator

│ ├── ProductPage.ts # Page Object for the product detail page

│ └── BasketPage.ts # Page Object for the basket page

├── tests/

│ └── cableGuyJourney.spec.ts # Test specs

├── playwright.config.ts # Playwright configuration

├── QUALITY_STRATEGY.md # Risk analysis and testing approach

├── INVESTIGATION_NOTES.md # Scenario rationale, flakiness notes, improvements

├── AI_DISCLOSURE.md # AI usage transparency

├── selector-inspector.ts # Exploration script used to identify DOM selectors

└── README.md # This file

## Test Coverage

| Test                       | Description                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------- |
| Core configuration journey | BNC female → BNC male → product page → Add to Basket → verify basket → remove item |
| Reset filter               | Selecting a connector and resetting restores the full result count                 |

## Notes

Tests run against the live production site. Product availability and pricing
may affect results. The results count assertions use relative comparisons
(filtered < initial) rather than exact numbers to account for live catalogue changes.
