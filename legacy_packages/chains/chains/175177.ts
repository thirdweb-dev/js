import type { Chain } from "../src/types";
export default {
  "chain": "LitProtocol",
  "chainId": 175177,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://chain.litprotocol.com/",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://explorer.litprotocol.com/svg/logo.svg",
    "width": 120,
    "height": 120,
    "format": "svg"
  },
  "name": "Lit Protocol",
  "nativeCurrency": {
    "name": "LitProtocol",
    "symbol": "LIT",
    "decimals": 18
  },
  "networkId": 175177,
  "redFlags": [],
  "rpc": [
    "https://175177.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain-rpc.litprotocol.com/http"
  ],
  "shortName": "Lit",
  "slug": "lit-protocol",
  "testnet": true
} as const satisfies Chain;