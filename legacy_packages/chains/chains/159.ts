import type { Chain } from "../src/types";
export default {
  "chain": "RBAT",
  "chainId": 159,
  "explorers": [
    {
      "name": "Rbascan Testnet Explorer",
      "url": "https://testnet.rbascan.com",
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
  "name": "Roburna Testnet",
  "nativeCurrency": {
    "name": "Roburna",
    "symbol": "RBAT",
    "decimals": 18
  },
  "networkId": 159,
  "rpc": [
    "https://159.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://preseed-testnet-1.roburna.com"
  ],
  "shortName": "rbat",
  "slug": "roburna-testnet",
  "testnet": true
} as const satisfies Chain;