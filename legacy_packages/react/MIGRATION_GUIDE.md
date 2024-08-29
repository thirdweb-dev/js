# Migration Guide

If you are looking to upgrade from an earlier version of the React SDK, below are the breaking changes that you should be aware of between each version.

## Upgrading to Version 3

Version 3 of the React SDK introduces a significant (87%) reduction in package size and first-class support for using custom contracts with the SDK. Learn more about why we made these changes and how they improve the SDK in our [blog post](https://blog.thirdweb.com/sdk-major-update/).

### useContractData

The `useContractData` hook to read data from a smart contract has been renamed to `useContractRead`.

```diff
- const { data } = useContractData(contract, 'name')
+ const { data } = useContractRead(contract, 'name')
```

### useContractCall

The `useContractCall` hook to call a smart contract function has been renamed to `useContractWrite`.

```diff
- const { mutate } = useContractCall(contract, 'setName')
+ const { mutate } = useContractWrite(contract, 'setName')
```

### Prebuilt Contract Hooks

Hooks to connect to prebuilt contracts such as `useNFTDrop` and `useMarketplace` are now deprecated in favour of using the generic `useContract` hook followed by the contract type:

```diff
- const contract = useNFTDrop("0x...")
+ const { contract } = useContract("0x...", "nft-drop")
```

You can currently still continue to use the prebuilt hooks, however they provide a warning in the console informing you of their deprecation. We will likely remove these hooks in a future version of the SDK.

### New Contract Namespaces

When working with contracts using the `useContract` hook, we now expose all the convenient high level APIs for each ERC standard top level.
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

The `Web3Button`'s `contract` benefits from these changes as well:

```diff jsx
<Web3Button
  contractAddress={...}
-  action={(contract) => contract.nft?.drop?.claim?.to(...)}
+  action={(contract) => contract.erc721.claim(...)}
>
  Claim
</Web3Button>
```
