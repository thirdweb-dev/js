import type { Chain } from "../src/types";
export default {
  "chainId": 94,
  "chain": "SDLT",
  "name": "SwissDLT",
  "rpc": [
    "https://swissdlt.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.swissdlt.ch"
  ],
  "slug": "swissdlt",
  "icon": {
    "url": "ipfs://bafkreig7x5z4j6vh2r3pugmjnob3tmlksaekhqcgsorqzvs55o6v7ehqd4",
    "width": 682,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "BCTS",
    "symbol": "BCTS",
    "decimals": 18
  },
  "infoURL": "https://bcts.ch",
  "shortName": "sdlt",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "SwissDLT Explorer",
      "url": "https://explorer.swissdlt.ch",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;