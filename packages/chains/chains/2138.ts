import type { Chain } from "../src/types";
export default {
  "chainId": 2138,
  "chain": "dfiometatest",
  "name": "Defi Oracle Meta Testnet",
  "rpc": [
    "https://defi-oracle-meta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.public-2138.defi-oracle.io",
    "wss://rpc.public-2138.defi-oracle.io"
  ],
  "slug": "defi-oracle-meta-testnet",
  "icon": {
    "url": "ipfs://QmYrMRnjQJcNkYq9AvZ2FQ9kzYj9szzP4YDmyNA1ybd8xE",
    "width": 1000,
    "height": 1043,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "testEther",
    "symbol": "tETH",
    "decimals": 18
  },
  "infoURL": "https://defi-oracle.io/",
  "shortName": "dfio-meta-test",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Quorum Explorer",
      "url": "https://public-2138.defi-oracle.io",
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