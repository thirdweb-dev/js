import type { Chain } from "../src/types";
export default {
  "chainId": 23294,
  "chain": "Sapphire",
  "name": "Oasis Sapphire",
  "rpc": [
    "https://oasis-sapphire.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sapphire.oasis.io",
    "wss://sapphire.oasis.io/ws"
  ],
  "slug": "oasis-sapphire",
  "icon": {
    "url": "ipfs://bafkreiespupb52akiwrexxg7g72mh7m7h7lum5hmqijmpdh3kmuunzclha",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Sapphire Rose",
    "symbol": "ROSE",
    "decimals": 18
  },
  "infoURL": "https://docs.oasis.io/dapp/sapphire",
  "shortName": "sapphire",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Oasis Sapphire Explorer",
      "url": "https://explorer.sapphire.oasis.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;