import type { Chain } from "../src/types";
export default {
  "chain": "RSS3",
  "chainId": 2331,
  "explorers": [
    {
      "name": "RSS3 VSL Sepolia Testnet Scan",
      "url": "https://scan.testnet.rss3.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTE6hnMTQaGU8Fm7nQbeTqQ5Ha3kyLKHR6QTd59prP2mC",
    "width": 200,
    "height": 200,
    "format": "svg"
  },
  "infoURL": "https://rss3.io",
  "name": "RSS3 VSL Sepolia Testnet",
  "nativeCurrency": {
    "name": "RSS3",
    "symbol": "RSS3",
    "decimals": 18
  },
  "networkId": 2331,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://explorer.testnet.rss3.io/bridge"
      }
    ]
  },
  "rpc": [
    "https://2331.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.rss3.io"
  ],
  "shortName": "rss3-testnet",
  "slug": "rss3-vsl-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;