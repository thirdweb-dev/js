import type { Chain } from "../src/types";
export default {
  "chain": "dfiometa",
  "chainId": 138,
  "explorers": [
    {
      "name": "Quorum Explorer",
      "url": "https://public-0138.defi-oracle.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmYrMRnjQJcNkYq9AvZ2FQ9kzYj9szzP4YDmyNA1ybd8xE",
    "width": 1000,
    "height": 1043,
    "format": "png"
  },
  "infoURL": "https://defi-oracle.io/",
  "name": "Defi Oracle Meta Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://defi-oracle-meta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.public-0138.defi-oracle.io",
    "wss://rpc.public-0138.defi-oracle.io"
  ],
  "shortName": "dfio-meta-main",
  "slug": "defi-oracle-meta",
  "testnet": false
} as const satisfies Chain;