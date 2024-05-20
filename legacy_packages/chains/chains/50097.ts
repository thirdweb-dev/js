import type { Chain } from "../src/types";
export default {
  "chain": "BTC",
  "chainId": 50097,
  "explorers": [
    {
      "name": "Zytron Explorer",
      "url": "http://b2-testnet-zytron-blockscout.zypher.game/",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeiaav4gyweksnce4asrkqxxjevkpcx7xol6a72kzihrhppb5p5z6aa/zytron_T_white.png",
    "width": 1420,
    "height": 400,
    "format": "png"
  },
  "name": "Zytron B2 Testnet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 50097,
  "redFlags": [],
  "rpc": [],
  "shortName": "zytron-b2-testnet",
  "slug": "zytron-b2-testnet",
  "testnet": true
} as const satisfies Chain;