export default {
  "name": "Fibonacci Mainnet",
  "chain": "FIBO",
  "icon": {
    "url": "ipfs://bafkreidiedaz3jugxmh2ylzlc4nympbd5iwab33adhwkcnblyop6vvj25y",
    "width": 1494,
    "height": 1494,
    "format": "png"
  },
  "rpc": [
    "https://fibonacci.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.fibo-api.asia"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "FIBONACCI UTILITY TOKEN",
    "symbol": "FIBO",
    "decimals": 18
  },
  "infoURL": "https://fibochain.org",
  "shortName": "fibo",
  "chainId": 12306,
  "networkId": 1230,
  "explorers": [
    {
      "name": "fiboscan",
      "url": "https://scan.fibochain.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "fibonacci"
} as const;