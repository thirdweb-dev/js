import type { Chain } from "../src/types";
export default {
  "chain": "dfiometatest",
  "chainId": 2138,
  "explorers": [
    {
      "name": "Quorum Explorer",
      "url": "https://public-2138.defi-oracle.io",
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
  "name": "Defi Oracle Meta Testnet",
  "nativeCurrency": {
    "name": "testEther",
    "symbol": "tETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://defi-oracle-meta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.public-2138.defi-oracle.io",
    "wss://rpc.public-2138.defi-oracle.io"
  ],
  "shortName": "dfio-meta-test",
  "slug": "defi-oracle-meta-testnet",
  "testnet": true
} as const satisfies Chain;