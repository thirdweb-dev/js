import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 202624,
  "explorers": [
    {
      "name": "Jellie Blockchain Explorer",
      "url": "https://jellie.twala.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmTXJVhVKvVC7DQEnGKXvydvwpvVaUEBJrMHvsCr4nr1sK",
    "width": 1326,
    "height": 1265,
    "format": "png"
  },
  "infoURL": "https://twala.io/",
  "name": "Jellie",
  "nativeCurrency": {
    "name": "Twala Coin",
    "symbol": "TWL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://jellie.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jellie-rpc.twala.io/",
    "wss://jellie-rpc-wss.twala.io/"
  ],
  "shortName": "twl-jellie",
  "slug": "jellie",
  "testnet": true
} as const satisfies Chain;