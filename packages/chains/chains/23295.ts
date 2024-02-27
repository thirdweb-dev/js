import type { Chain } from "../src/types";
export default {
  "chain": "Sapphire",
  "chainId": 23295,
  "explorers": [
    {
      "name": "Oasis Sapphire Testnet Explorer",
      "url": "https://testnet.explorer.sapphire.oasis.dev",
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
  "infoURL": "https://docs.oasis.io/dapp/sapphire",
  "name": "Oasis Sapphire Testnet",
  "nativeCurrency": {
    "name": "Sapphire Test Rose",
    "symbol": "TEST",
    "decimals": 18
  },
  "networkId": 23295,
  "rpc": [
    "https://23295.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.sapphire.oasis.dev",
    "wss://testnet.sapphire.oasis.dev/ws"
  ],
  "shortName": "sapphire-testnet",
  "slip44": 1,
  "slug": "oasis-sapphire-testnet",
  "testnet": true
} as const satisfies Chain;