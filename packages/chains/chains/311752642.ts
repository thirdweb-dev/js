export default {
  "name": "OneLedger Mainnet",
  "chain": "OLT",
  "icon": {
    "url": "ipfs://QmRhqq4Gp8G9w27ND3LeFW49o5PxcxrbJsqHbpBFtzEMfC",
    "width": 225,
    "height": 225,
    "format": "png"
  },
  "rpc": [
    "https://oneledger.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.oneledger.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OLT",
    "symbol": "OLT",
    "decimals": 18
  },
  "infoURL": "https://oneledger.io",
  "shortName": "oneledger",
  "chainId": 311752642,
  "networkId": 311752642,
  "explorers": [
    {
      "name": "OneLedger Block Explorer",
      "url": "https://mainnet-explorer.oneledger.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "oneledger"
} as const;