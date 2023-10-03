import type { Chain } from "../src/types";
export default {
  "chain": "Sapphire",
  "chainId": 23294,
  "explorers": [
    {
      "name": "Oasis Sapphire Explorer",
      "url": "https://explorer.sapphire.oasis.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreiespupb52akiwrexxg7g72mh7m7h7lum5hmqijmpdh3kmuunzclha",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "infoURL": "https://docs.oasis.io/dapp/sapphire",
  "name": "Oasis Sapphire",
  "nativeCurrency": {
    "name": "Sapphire Rose",
    "symbol": "ROSE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://oasis-sapphire.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sapphire.oasis.io",
    "wss://sapphire.oasis.io/ws"
  ],
  "shortName": "sapphire",
  "slug": "oasis-sapphire",
  "testnet": false
} as const satisfies Chain;