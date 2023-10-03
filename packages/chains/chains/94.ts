import type { Chain } from "../src/types";
export default {
  "chain": "SDLT",
  "chainId": 94,
  "explorers": [
    {
      "name": "SwissDLT Explorer",
      "url": "https://explorer.swissdlt.ch",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://bafkreig7x5z4j6vh2r3pugmjnob3tmlksaekhqcgsorqzvs55o6v7ehqd4",
    "width": 682,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://bcts.ch",
  "name": "SwissDLT",
  "nativeCurrency": {
    "name": "BCTS",
    "symbol": "BCTS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://swissdlt.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.swissdlt.ch"
  ],
  "shortName": "sdlt",
  "slug": "swissdlt",
  "testnet": false
} as const satisfies Chain;