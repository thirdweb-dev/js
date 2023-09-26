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
  "icon": {
    "url": "ipfs://bafkreig7x5z4j6vh2r3pugmjnob3tmlksaekhqcgsorqzvs55o6v7ehqd4",
    "width": 682,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "SwissDLT Explorer",
      "url": "https://explorer.swissdlt.ch",
      "icon": {
        "url": "ipfs://bafkreig7x5z4j6vh2r3pugmjnob3tmlksaekhqcgsorqzvs55o6v7ehqd4",
        "width": 682,
        "height": 512,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "swissdlt"
} as const satisfies Chain;