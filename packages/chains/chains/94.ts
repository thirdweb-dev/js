import type { Chain } from "../src/types";
export default {
  "name": "SwissDLT",
  "chain": "SDLT",
  "rpc": [
    "https://swissdlt.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.swissdlt.ch"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BCTS",
    "symbol": "BCTS",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://bcts.ch",
  "shortName": "sdlt",
  "chainId": 94,
  "networkId": 94,
  "icon": "bcts",
  "explorers": [
    {
      "name": "SwissDLT Explorer",
      "url": "https://explorer.swissdlt.ch",
      "icon": "bcts",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "swissdlt"
} as const satisfies Chain;