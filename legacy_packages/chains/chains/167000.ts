import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 167000,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://taiko.xyz",
  "name": "Taiko Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 167000,
  "redFlags": [],
  "rpc": [
    "https://167000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.taiko.xyz/",
    "https://rpc.ankr.com/taiko/",
    "https://rpc.taiko.xyz/",
    "https://rpc.taiko.xyz",
    "wss://ws.taiko.xyz"
  ],
  "shortName": "tko-mainnet",
  "slug": "taiko",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;