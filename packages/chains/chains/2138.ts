import type { Chain } from "../src/types";
export default {
  "chain": "dfiometatest",
  "chainId": 2138,
  "ens": {
    "registry": "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85"
  },
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
  "networkId": 21,
  "rpc": [
    "https://defi-oracle-meta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2138.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.public-2138.defi-oracle.io",
    "wss://rpc.public-2138.defi-oracle.io"
  ],
  "shortName": "dfio-meta-test",
  "slip44": 1,
  "slug": "defi-oracle-meta-testnet",
  "testnet": true
} as const satisfies Chain;