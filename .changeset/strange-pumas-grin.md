---
"@thirdweb-dev/sdk": minor
---

Unify NFT return types for EVM and Solana

#### NFT Types are now consistent accross EVM (both ERC721 and ERC1155) and Solana

This is a transparent upgrade, except for one type change for ERC1155 NFTs

- nft.id is now of type `string` instead of `BigNumber`
- edition.supply is now of type `number` instead of `BigNumber`

This should make it much easer to deal with in applications, instead of having to manipulate BigNumber objects.

Most people convert BigNumber to strings, which is compatible with this upgrade.
