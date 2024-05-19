import type { Chain } from "../src/types";
export default {
  "chain": "FIBO",
  "chainId": 12306,
  "explorers": [
    {
      "name": "fiboscan",
      "url": "https://scan.fibochain.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://test.fibochain.org/faucets"
  ],
  "infoURL": "https://fibochain.org",
  "name": "Fibonacci Mainnet",
  "nativeCurrency": {
    "name": "FIBONACCI UTILITY TOKEN",
    "symbol": "FIBO",
    "decimals": 18
  },
  "networkId": 1230,
  "rpc": [
    "https://12306.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.fibo-api.asia",
    "https://node2.fibo-api.asia",
    "https://node3.fibo-api.asia",
    "https://node4.fibo-api.asia",
    "https://node5.fibo-api.asia",
    "https://node6.fibo-api.asia",
    "https://node7.fibo-api.asia",
    "https://node1.fibo-rpc.asia",
    "https://node2.fibo-rpc.asia",
    "https://node3.fibo-rpc.asia",
    "https://node4.fibo-rpc.asia",
    "https://node5.fibo-rpc.asia",
    "https://node6.fibo-rpc.asia",
    "https://node7.fibo-rpc.asia"
  ],
  "shortName": "fibo",
  "slug": "fibonacci",
  "testnet": true
} as const satisfies Chain;