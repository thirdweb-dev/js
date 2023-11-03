import type { Chain } from "../types";
export default {
  "chain": "OLT",
  "chainId": 4216137055,
  "explorers": [
    {
      "name": "OneLedger Block Explorer",
      "url": "https://frankenstein-explorer.oneledger.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://frankenstein-faucet.oneledger.network"
  ],
  "icon": {
    "url": "ipfs://QmRhqq4Gp8G9w27ND3LeFW49o5PxcxrbJsqHbpBFtzEMfC",
    "width": 225,
    "height": 225,
    "format": "png"
  },
  "infoURL": "https://oneledger.io",
  "name": "OneLedger Testnet Frankenstein",
  "nativeCurrency": {
    "name": "OLT",
    "symbol": "OLT",
    "decimals": 18
  },
  "networkId": 4216137055,
  "rpc": [
    "https://oneledger-testnet-frankenstein.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4216137055.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://frankenstein-rpc.oneledger.network"
  ],
  "shortName": "frankenstein",
  "slug": "oneledger-testnet-frankenstein",
  "testnet": true
} as const satisfies Chain;