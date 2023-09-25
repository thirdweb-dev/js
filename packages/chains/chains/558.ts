import type { Chain } from "../src/types";
export default {
  "chainId": 558,
  "chain": "TAO",
  "name": "Tao Network",
  "rpc": [
    "https://tao-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.tao.network",
    "http://rpc.testnet.tao.network:8545",
    "https://rpc.tao.network",
    "wss://rpc.tao.network"
  ],
  "slug": "tao-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Tao",
    "symbol": "TAO",
    "decimals": 18
  },
  "infoURL": "https://tao.network",
  "shortName": "tao",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;