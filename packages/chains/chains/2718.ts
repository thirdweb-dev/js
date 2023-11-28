import type { Chain } from "../src/types";
export default {
  "chain": "K-LAOS",
  "chainId": 2718,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.klaos.laosfoundation.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmW26eoxJeyUfikZ4DUT1Gfk78sBkvydEo8QzHa1BXjUUL",
        "width": 580,
        "height": 580,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmW26eoxJeyUfikZ4DUT1Gfk78sBkvydEo8QzHa1BXjUUL",
    "width": 580,
    "height": 580,
    "format": "png"
  },
  "infoURL": "https://www.laosfoundation.io/",
  "name": "K-LAOS",
  "nativeCurrency": {
    "name": "KLAOS",
    "symbol": "KLAOS",
    "decimals": 18
  },
  "networkId": 2718,
  "rpc": [
    "https://k-laos.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2718.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.klaos.laosfoundation.io",
    "wss://rpc.klaos.laosfoundation.io"
  ],
  "shortName": "k-laos",
  "slug": "k-laos",
  "testnet": false,
  "title": "K-LAOS: LAOS on Kusama"
} as const satisfies Chain;