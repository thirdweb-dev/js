import type { Chain } from "../types";
export default {
  "chain": "Emerald",
  "chainId": 42262,
  "explorers": [
    {
      "name": "Oasis Emerald Explorer",
      "url": "https://explorer.emerald.oasis.dev",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreiespupb52akiwrexxg7g72mh7m7h7lum5hmqijmpdh3kmuunzclha",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "infoURL": "https://docs.oasis.io/dapp/emerald",
  "name": "Oasis Emerald",
  "nativeCurrency": {
    "name": "Emerald Rose",
    "symbol": "ROSE",
    "decimals": 18
  },
  "networkId": 42262,
  "rpc": [
    "https://oasis-emerald.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://42262.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://emerald.oasis.dev",
    "wss://emerald.oasis.dev/ws"
  ],
  "shortName": "emerald",
  "slug": "oasis-emerald",
  "testnet": false
} as const satisfies Chain;