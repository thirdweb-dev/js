import type { Chain } from "../src/types";
export default {
  "chain": "OLT",
  "chainId": 311752642,
  "explorers": [
    {
      "name": "OneLedger Block Explorer",
      "url": "https://mainnet-explorer.oneledger.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://oneledger.io",
  "name": "OneLedger Mainnet",
  "nativeCurrency": {
    "name": "OLT",
    "symbol": "OLT",
    "decimals": 18
  },
  "networkId": 311752642,
  "rpc": [
    "https://311752642.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.oneledger.network"
  ],
  "shortName": "oneledger",
  "slug": "oneledger",
  "testnet": false
} as const satisfies Chain;