# AI Usage Disclosure

## Tools Used

Claude (Anthropic) was used as a supporting tool during this task.

## How AI Was Used

**Sounding board for scope decisions** – I used Claude to pressure-test my
thinking on test scope. The core question I was working through was: when is
a journey complete enough to be meaningful without becoming over-engineered?
That judgment call was mine.

**Code scaffolding** – After making my own decisions on selectors, page structure,
and test scenarios, I used Claude to help scaffold the initial code structure.

**Document drafting** – Claude helped structure the Quality Strategy and
Investigation Notes. The content — risk analysis, trade-off decisions,
observations — came from my own testing and analysis.

## What I Manually Verified

- Explored the full Cable Guy journey hands-on before writing a single line of code
- Inspected all selectors with Chrome DevTools against the live DOM
- Discovered that clicking `div.cg-plugItem` (the whole card) is the correct
  interaction — not the text label inside it
- Discovered that Add to Basket on the product details page redirects directly
  to the basket — this was not described in the task and changed my approach
  to the journey scope
- Ran all tests locally and debugged failures myself by reading error output
  and screenshots

## Which Decisions Were Based on My Own Testing Judgment

- Choosing BNC female → BNC male as the primary scenario based on manual
  exploration of the connector options
- Deciding how far the journey should go — the key question was whether
  "continue toward purchase" means reaching the Add to Basket button or
  completing the basket interaction. After discovering the redirect behaviour
  manually, I extended the test to cover add → verify → remove
- Not automating slider interactions — too fragile, low ROI
- Replacing `toBe(initialCount)` with `toBeGreaterThan(filtered)` after
  observing live catalogue count variability between runs
- Cookie banner handled defensively because live sites behave differently
  across sessions
