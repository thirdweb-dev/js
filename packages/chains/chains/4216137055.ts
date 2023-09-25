import type { Chain } from "../src/types";
export default {
  "chainId": 4216137055,
  "chain": "OLT",
  "name": "OneLedger Testnet Frankenstein",
  "rpc": [
    "https://oneledger-testnet-frankenstein.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://frankenstein-rpc.oneledger.network"
  ],
  "slug": "oneledger-testnet-frankenstein",
  "icon": {
    "url": "ipfs://QmRhqq4Gp8G9w27ND3LeFW49o5PxcxrbJsqHbpBFtzEMfC",
    "width": 225,
    "height": 225,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "OneLedger Block Explorer",
      "url": "https://frankenstein-explorer.oneledger.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;