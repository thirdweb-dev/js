import type { Chain } from "../src/types";
export default {
  "chain": "Zircuit Testnet",
  "chainId": 48899,
  "explorers": [
    {
      "name": "Zircuit",
      "url": "https://explorer.zircuit.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmV4nUUiRaTTZSyWubpF98ZL9jNCoXkrgg6AWR6FKqdxMk",
        "width": 256,
        "height": 256,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmV4nUUiRaTTZSyWubpF98ZL9jNCoXkrgg6AWR6FKqdxMk",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://www.zircuit.com/",
  "name": "Zircuit Testnet",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 48899,
  "rpc": [
    "https://48899.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zircuit1.p2pify.com/"
  ],
  "shortName": "zircuit-testnet",
  "slug": "zircuit-testnet",
  "testnet": true
} as const satisfies Chain;