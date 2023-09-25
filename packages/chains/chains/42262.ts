import type { Chain } from "../src/types";
export default {
  "chainId": 42262,
  "chain": "Emerald",
  "name": "Oasis Emerald",
  "rpc": [
    "https://oasis-emerald.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://emerald.oasis.dev",
    "wss://emerald.oasis.dev/ws"
  ],
  "slug": "oasis-emerald",
  "icon": {
    "url": "ipfs://bafkreiespupb52akiwrexxg7g72mh7m7h7lum5hmqijmpdh3kmuunzclha",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Emerald Rose",
    "symbol": "ROSE",
    "decimals": 18
  },
  "infoURL": "https://docs.oasis.io/dapp/emerald",
  "shortName": "emerald",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Oasis Emerald Explorer",
      "url": "https://explorer.emerald.oasis.dev",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;