import type { Chain } from "../src/types";
export default {
  "chain": "UltronSmartchain",
  "chainId": 662,
  "explorers": [
    {
      "name": "ultronsmartchain explorer",
      "url": "https://scan.ultronsmartchain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTns2FXAqDCq1QJsocUBGjhxsgWYK7pFfD4UrRZ9JBsF1",
    "width": 50,
    "height": 50,
    "format": "png"
  },
  "infoURL": "https://ultronsmartchain.io",
  "name": "UltronSmartchain",
  "nativeCurrency": {
    "name": "ulc",
    "symbol": "ULC",
    "decimals": 18
  },
  "networkId": 662,
  "rpc": [
    "https://662.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ultronsmartchain.io"
  ],
  "shortName": "ultronsmartchain",
  "slug": "ultronsmartchain",
  "testnet": false
} as const satisfies Chain;