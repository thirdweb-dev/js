---
"@thirdweb-dev/react": major
---

3.0.0 update

## _MAJOR VERSION CHANGE_

#### Breaking changes:

1. Hooks now accept custom contracts direclty and handle the logic internally

before

```javascript
const { contract } = useContract(...)
const { data: nfts } = useNFTs(contract?.nft)
const { mutation: claim } = useClaimNFT(contract?.nft)
```

after

```javascript
const { contract } = useContract(...)
// works with any ERC721/ERC1155 contract
const { data: nfts} = useNFTs(contract)
const { mutation: claim } = useClaimNFT(contract)
```

2. Web3Button benefits from the new Extension detection API:

before

```jsx
<Web3Button
  contractAddress={...}
  action={(contract) => contract.nft?.drop?.claim?.to(...)}
  >
  Claim
  </Web3Button>
```

after

```jsx
<Web3Button
  contractAddress={...}
  action={(contract) => contract.erc721.claim(...) }
  >
  Claim
  </Web3Button>
```
