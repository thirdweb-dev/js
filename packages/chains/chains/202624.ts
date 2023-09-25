import type { Chain } from "../src/types";
export default {
  "chainId": 202624,
  "chain": "ETH",
  "name": "Jellie",
  "rpc": [
    "https://jellie.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jellie-rpc.twala.io/",
    "wss://jellie-rpc-wss.twala.io/"
  ],
  "slug": "jellie",
  "icon": {
    "url": "ipfs://QmTXJVhVKvVC7DQEnGKXvydvwpvVaUEBJrMHvsCr4nr1sK",
    "width": 1326,
    "height": 1265,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Twala Coin",
    "symbol": "TWL",
    "decimals": 18
  },
  "infoURL": "https://twala.io/",
  "shortName": "twl-jellie",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Jellie Blockchain Explorer",
      "url": "https://jellie.twala.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;