import type { Chain } from "../src/types";
export default {
  "chainId": 311752642,
  "chain": "OLT",
  "name": "OneLedger Mainnet",
  "rpc": [
    "https://oneledger.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.oneledger.network"
  ],
  "slug": "oneledger",
  "icon": {
    "url": "ipfs://QmRhqq4Gp8G9w27ND3LeFW49o5PxcxrbJsqHbpBFtzEMfC",
    "width": 225,
    "height": 225,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "OLT",
    "symbol": "OLT",
    "decimals": 18
  },
  "infoURL": "https://oneledger.io",
  "shortName": "oneledger",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "OneLedger Block Explorer",
      "url": "https://mainnet-explorer.oneledger.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;