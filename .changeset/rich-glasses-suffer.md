---
"@thirdweb-dev/chains": patch
---

deprecate `allChains` `getChainById` and `getChainBySlug`

all of these would (necessarily) pull in every single chain in the package (>600kb)

instead these can be replaced with their async variants:

- `allChains` -> `await fetchChains()`
- `getChainById(chainId)` -> `await getChainByIdAsync(chainId)`
- `getChainBySlug(chainSlug)` -> `await getChainBySlugAsync(chainSlug)`

these async functions will return the same data as their sync counterparts, but without having to pull in every single chain at build-time.
