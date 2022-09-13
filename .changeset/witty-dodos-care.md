---
"@thirdweb-dev/sdk": major
---

3.0.0 update

## _MAJOR VERSION CHANGE_

- 85% reduction in package size!
- Custom contracts are now first class citizens

Full changelog:

#### Breaking changes:

1. Getting contracts is now async. This allows dynamically importing contracts and reduces the weight of the SDK significantly.

before:

```javascript
const token = sdk.getToken(...)
const nftDrop = sdk.getNFTDrop(...)
```

after:

```javascript
const token = await sdk.getToken(...)
const nftDrop = await sdk.getNFTDrop(...)
```

2. New Extension API for custom contracts

When working with custom contracts using `await sdk.getContract(...)`, we now expose all the convenient high level APIs for each ERC standard top level. Calling a function that is not supported in your contract will give you an error with instructions on how to unlock that functionality.

before:

```javascript
const contract = await sdk.getContract(...)
// ERC721 contracts
const contract.nft?.drop?.claim?.to(...)
const contract.nft?.drop?.claim?.conditions.set(...)
// ERC1155 contracts
const contract.edition?.mint?.to(...)
// ERC20 contracts
const contract.token?.burn.tokens(...)
```

after:

```javascript
const contract = await sdk.getContract(...)
// ERC721 contracts
const contract.erc721.claimTo(...)
const contract.erc721.claimConditions.set(...)
// ERC1155 contracts
const contract.erc1155.mintTo(...)
// ERC20 contracts
const contract.erc20.burn(...)
```
