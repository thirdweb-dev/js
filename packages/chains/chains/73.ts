export default {
  "name": "FNCY",
  "chain": "FNCY",
  "rpc": [
    "https://fncy.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fncy-seed1.fncy.world"
  ],
  "faucets": [
    "https://faucet-testnet.fncy.world"
  ],
  "nativeCurrency": {
    "name": "FNCY",
    "symbol": "FNCY",
    "decimals": 18
  },
  "infoURL": "https://fncyscan.fncy.world",
  "shortName": "FNCY",
  "chainId": 73,
  "networkId": 73,
  "icon": {
    "url": "ipfs://QmfXCh6UnaEHn3Evz7RFJ3p2ggJBRm9hunDHegeoquGuhD",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "explorers": [
    {
      "name": "fncy scan",
      "url": "https://fncyscan.fncy.world",
      "icon": "fncy",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "fncy"
} as const;