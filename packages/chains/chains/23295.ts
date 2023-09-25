import type { Chain } from "../src/types";
export default {
  "chainId": 23295,
  "chain": "Sapphire",
  "name": "Oasis Sapphire Testnet",
  "rpc": [
    "https://oasis-sapphire-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.sapphire.oasis.dev",
    "wss://testnet.sapphire.oasis.dev/ws"
  ],
  "slug": "oasis-sapphire-testnet",
  "icon": {
    "url": "ipfs://bafkreiespupb52akiwrexxg7g72mh7m7h7lum5hmqijmpdh3kmuunzclha",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Sapphire Test Rose",
    "symbol": "TEST",
    "decimals": 18
  },
  "infoURL": "https://docs.oasis.io/dapp/sapphire",
  "shortName": "sapphire-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Oasis Sapphire Testnet Explorer",
      "url": "https://testnet.explorer.sapphire.oasis.dev",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;