import type { Chain } from "../src/types";
export default {
  "chain": "RBA",
  "chainId": 158,
  "explorers": [
    {
      "name": "Rbascan Explorer",
      "url": "https://rbascan.com",
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
    "url": "ipfs://QmTk1uhB9nvnvXifvwEPGFcdgsXRt4EXNjovUGyUmfFRcB",
    "width": 4000,
    "height": 4000,
    "format": "png"
  },
  "infoURL": "https://www.roburna.com/",
  "name": "Roburna Mainnet",
  "nativeCurrency": {
    "name": "Roburna",
    "symbol": "RBA",
    "decimals": 18
  },
  "networkId": 158,
  "rpc": [
    "https://158.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed.roburna.com"
  ],
  "shortName": "rba",
  "slug": "roburna",
  "testnet": false
} as const satisfies Chain;