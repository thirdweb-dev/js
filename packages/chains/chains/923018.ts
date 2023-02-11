export default {
  "name": "FNCY Testnet",
  "chain": "FNCY",
  "rpc": [
    "https://fncy-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fncy-testnet-seed.fncy.world"
  ],
  "faucets": [
    "https://faucet-testnet.fncy.world"
  ],
  "nativeCurrency": {
    "name": "FNCY",
    "symbol": "FNCY",
    "decimals": 18
  },
  "infoURL": "https://fncyscan-testnet.fncy.world",
  "shortName": "tFNCY",
  "chainId": 923018,
  "networkId": 923018,
  "icon": {
    "url": "ipfs://QmfXCh6UnaEHn3Evz7RFJ3p2ggJBRm9hunDHegeoquGuhD",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "explorers": [
    {
      "name": "fncy scan testnet",
      "url": "https://fncyscan-testnet.fncy.world",
      "icon": "fncy",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "fncy-testnet"
} as const;