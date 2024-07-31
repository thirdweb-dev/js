import type { Chain } from "../src/types";
export default {
  "chain": "Zircuit Mainnet",
  "chainId": 48900,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmV4nUUiRaTTZSyWubpF98ZL9jNCoXkrgg6AWR6FKqdxMk",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://www.zircuit.com/",
  "name": "Zircuit Mainnet",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 48900,
  "rpc": [],
  "shortName": "zircuit-mainnet",
  "slug": "zircuit",
  "testnet": false
} as const satisfies Chain;