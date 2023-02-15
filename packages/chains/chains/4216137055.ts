export default {
  "name": "OneLedger Testnet Frankenstein",
  "chain": "OLT",
  "icon": {
    "url": "ipfs://QmRhqq4Gp8G9w27ND3LeFW49o5PxcxrbJsqHbpBFtzEMfC",
    "width": 225,
    "height": 225,
    "format": "png"
  },
  "rpc": [
    "https://oneledger-testnet-frankenstein.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://frankenstein-rpc.oneledger.network"
  ],
  "faucets": [
    "https://frankenstein-faucet.oneledger.network"
  ],
  "nativeCurrency": {
    "name": "OLT",
    "symbol": "OLT",
    "decimals": 18
  },
  "infoURL": "https://oneledger.io",
  "shortName": "frankenstein",
  "chainId": 4216137055,
  "networkId": 4216137055,
  "explorers": [
    {
      "name": "OneLedger Block Explorer",
      "url": "https://frankenstein-explorer.oneledger.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "oneledger-testnet-frankenstein"
} as const;