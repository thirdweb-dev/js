# Migration Guide

If you are looking to upgrade from an earlier version of the SDK, below are the breaking changes that you should be aware of between each version.

## Upgrading to Version 3

Version 3 of the SDK introduces a significant (87%) reduction in package size and first-class support for using custom contracts with the SDK. Learn more about why we made these changes and how they improve the SDK in our [blog post](https://blog.thirdweb.com/sdk-major-update/).

### Getting Contracts is now Async

The `getContract` and similar functions such as `getNFTDrop` or `getMarketplace` are now asynchronous. This means that you will need to `await` the result of these functions before using them.

**Custom**:

```diff
- const contract = getContract("0x...")
+ const contract = await getContract("0x...")
```

**Prebuilt**:

```diff
- const contract = getNFTDrop("0x...")
+ const contract = await getNFTDrop("0x...")
```

### New Contract Namespaces

When working with contracts, we now expose all the convenient high-level APIs for each ERC standard top level.
Calling a function that is not supported in your contract will give you an error with instructions on how to unlock that functionality.

```diff
// ERC721 contracts
- const contract.nft?.drop?.claim?.to(...)
+ const contract.erc721.claimTo(...)
- const contract.nft?.drop?.claim?.conditions.set(...)
+ const contract.erc721.claimConditions.set(...)

// ERC1155 contracts
- const contract.edition?.mint?.to(...)
+ const contract.erc1155.mintTo(...)

// ERC20 contracts
- const contract.token?.burn.tokens(...)
+ const contract.erc20.burn(...)
```
