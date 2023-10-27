import type { Chain } from "../src/types";
export default {
  "chain": "TAO",
  "chainId": 558,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://tao.network",
  "name": "Tao Network",
  "nativeCurrency": {
    "name": "Tao",
    "symbol": "TAO",
    "decimals": 18
  },
  "networkId": 558,
  "rpc": [
    "https://tao-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://558.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.tao.network",
    "http://rpc.testnet.tao.network:8545",
    "https://rpc.tao.network",
    "wss://rpc.tao.network"
  ],
  "shortName": "tao",
  "slug": "tao-network",
  "testnet": true
} as const satisfies Chain;