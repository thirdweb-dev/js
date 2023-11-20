import type { Chain } from "../src/types";
export default {
  "chain": "dfiometa",
  "chainId": 138,
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
  "networkId": 1,
  "rpc": [
    "https://defi-oracle-meta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://138.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.public-0138.defi-oracle.io",
    "wss://rpc.public-0138.defi-oracle.io"
  ],
  "shortName": "dfio-meta-main",
  "slip44": 60,
  "slug": "defi-oracle-meta",
  "testnet": false
} as const satisfies Chain;