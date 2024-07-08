---
"thirdweb": patch
---

Pay UI improvements

- Only perform token amount rounding when rendering the amount - not in state
- increase the rendered decimals for token amount whereever we have enough space available in UI
- Fix "Minimum required amount" error message for Buy with fiat when token amount is so low that server calculates its value as 0 USD - which prevents calculation of minimum required token amount
- Show token symbol in Minimum required amount error message