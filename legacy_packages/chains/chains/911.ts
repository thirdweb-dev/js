import type { Chain } from "../src/types";
export default {
  "chain": "TAPROOT CHAIN",
  "chainId": 911,
  "explorers": [
    {
      "name": "TAPROOT Scan",
      "url": "https://scan.taprootchain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://taprootchain.io",
  "name": "TAPROOT Mainnet",
  "nativeCurrency": {
    "name": "TBTC",
    "symbol": "TBTC",
    "decimals": 18
  },
  "networkId": 911,
  "rpc": [
    "https://911.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.taprootchain.io"
  ],
  "shortName": "TAPROOT-Mainnet",
  "slug": "taproot",
  "testnet": false,
  "title": "TAPROOT Mainnet"
} as const satisfies Chain;