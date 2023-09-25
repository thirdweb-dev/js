import type { Chain } from "../src/types";
export default {
  "chainId": 12306,
  "chain": "FIBO",
  "name": "Fibonacci Mainnet",
  "rpc": [
    "https://fibonacci.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
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
  "slug": "fibonacci",
  "icon": {
    "url": "ipfs://bafkreidiedaz3jugxmh2ylzlc4nympbd5iwab33adhwkcnblyop6vvj25y",
    "width": 1494,
    "height": 1494,
    "format": "png"
  },
  "faucets": [
    "https://test.fibochain.org/faucets"
  ],
  "nativeCurrency": {
    "name": "FIBONACCI UTILITY TOKEN",
    "symbol": "FIBO",
    "decimals": 18
  },
  "infoURL": "https://fibochain.org",
  "shortName": "fibo",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "fiboscan",
      "url": "https://scan.fibochain.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;