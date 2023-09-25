import type { Chain } from "../src/types";
export default {
  "chainId": 138,
  "chain": "dfiometa",
  "name": "Defi Oracle Meta Mainnet",
  "rpc": [
    "https://defi-oracle-meta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.public-0138.defi-oracle.io",
    "wss://rpc.public-0138.defi-oracle.io"
  ],
  "slug": "defi-oracle-meta",
  "icon": {
    "url": "ipfs://QmYrMRnjQJcNkYq9AvZ2FQ9kzYj9szzP4YDmyNA1ybd8xE",
    "width": 1000,
    "height": 1043,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://defi-oracle.io/",
  "shortName": "dfio-meta-main",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Quorum Explorer",
      "url": "https://public-0138.defi-oracle.io",
      "standard": "none"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;