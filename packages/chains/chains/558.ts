import type { Chain } from "../src/types";
export default {
  "chain": "TAO",
  "chainId": 558,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://tao.network",
  "name": "Tao Network",
  "nativeCurrency": {
    "name": "Tao",
    "symbol": "TAO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://tao-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.tao.network",
    "http://rpc.testnet.tao.network:8545",
    "https://rpc.tao.network",
    "wss://rpc.tao.network"
  ],
  "shortName": "tao",
  "slug": "tao-network",
  "testnet": true
} as const satisfies Chain;