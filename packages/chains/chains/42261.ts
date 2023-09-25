import type { Chain } from "../src/types";
export default {
  "chainId": 42261,
  "chain": "Emerald",
  "name": "Oasis Emerald Testnet",
  "rpc": [
    "https://oasis-emerald-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.emerald.oasis.dev/",
    "wss://testnet.emerald.oasis.dev/ws"
  ],
  "slug": "oasis-emerald-testnet",
  "icon": {
    "url": "ipfs://bafkreiespupb52akiwrexxg7g72mh7m7h7lum5hmqijmpdh3kmuunzclha",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "faucets": [
    "https://faucet.testnet.oasis.dev/"
  ],
  "nativeCurrency": {
    "name": "Emerald Rose",
    "symbol": "ROSE",
    "decimals": 18
  },
  "infoURL": "https://docs.oasis.io/dapp/emerald",
  "shortName": "emerald-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Oasis Emerald Testnet Explorer",
      "url": "https://testnet.explorer.emerald.oasis.dev",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;