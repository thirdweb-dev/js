import type { Chain } from "../src/types";
export default {
  "chain": "mainnet",
  "chainId": 7118,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmNR4Y3cUxefV7KGpGxMkjp5ofeJvbaUkR1GavsmTtK248",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://hth.world",
  "name": "Help The Homeless",
  "nativeCurrency": {
    "name": "Help The Homeless Coin",
    "symbol": "HTH",
    "decimals": 18
  },
  "networkId": 7118,
  "rpc": [],
  "shortName": "hth",
  "slug": "help-the-homeless",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;