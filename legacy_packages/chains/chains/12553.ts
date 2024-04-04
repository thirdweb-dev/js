import type { Chain } from "../src/types";
export default {
  "chain": "RSS3",
  "chainId": 12553,
  "explorers": [
    {
      "name": "RSS3 VSL Scan",
      "url": "https://scan.rss3.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZFWYnufi6G2Z54oJ25sx2yf2Skx5tseJHJJa6Hc1G34t",
    "width": 200,
    "height": 200,
    "format": "svg"
  },
  "infoURL": "https://rss3.io",
  "name": "RSS3 VSL Mainnet",
  "nativeCurrency": {
    "name": "RSS3",
    "symbol": "RSS3",
    "decimals": 18
  },
  "networkId": 12553,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://explorer.rss3.io/bridge"
      }
    ]
  },
  "rpc": [
    "https://12553.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.rss3.io"
  ],
  "shortName": "rss3",
  "slug": "rss3-vsl",
  "testnet": false
} as const satisfies Chain;