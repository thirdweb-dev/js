import type { Chain } from "../src/types";
export default {
  "name": "Defi Oracle Meta Mainnet",
  "chain": "dfiometa",
  "icon": {
    "url": "ipfs://QmYrMRnjQJcNkYq9AvZ2FQ9kzYj9szzP4YDmyNA1ybd8xE",
    "width": 1000,
    "height": 1043,
    "format": "png"
  },
  "rpc": [
    "https://defi-oracle-meta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.public-0138.defi-oracle.io",
    "wss://rpc.public-0138.defi-oracle.io"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://defi-oracle.io/",
  "shortName": "dfio-meta-main",
  "chainId": 138,
  "networkId": 1,
  "slip44": 60,
  "ens": {
    "registry": "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85"
  },
  "explorers": [
    {
      "name": "Quorum Explorer",
      "url": "https://public-0138.defi-oracle.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "defi-oracle-meta"
} as const satisfies Chain;