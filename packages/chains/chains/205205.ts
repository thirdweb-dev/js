import type { Chain } from "../src/types";
export default {
  "chain": "Auroria",
  "chainId": 205205,
  "explorers": [
    {
      "name": "Auroria Testnet Explorer",
      "url": "https://auroria.explorer.stratisevm.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://auroria.faucet.stratisevm.com"
  ],
  "icon": {
    "url": "ipfs://QmbkTh6qNYUnae5yNjied3qZqVyZcb4x3hfUpJ33bGg9QY",
    "width": 800,
    "height": 800,
    "format": "jpg"
  },
  "infoURL": "https://www.stratisplatform.com",
  "name": "Auroria Testnet",
  "nativeCurrency": {
    "name": "Auroria Stratis",
    "symbol": "tSTRAX",
    "decimals": 18
  },
  "networkId": 205205,
  "rpc": [
    "https://205205.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://auroria.rpc.stratisevm.com"
  ],
  "shortName": "auroria",
  "slug": "auroria-testnet",
  "testnet": true,
  "title": "Stratis Testnet Auroria"
} as const satisfies Chain;