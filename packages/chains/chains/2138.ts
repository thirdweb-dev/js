import type { Chain } from "../src/types";
export default {
  "name": "Defi Oracle Meta Testnet",
  "chain": "dfiometatest",
  "icon": {
    "url": "ipfs://QmYrMRnjQJcNkYq9AvZ2FQ9kzYj9szzP4YDmyNA1ybd8xE",
    "width": 1000,
    "height": 1043,
    "format": "png"
  },
  "rpc": [
    "https://defi-oracle-meta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.public-2138.defi-oracle.io",
    "wss://rpc.public-2138.defi-oracle.io"
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
    "name": "testEther",
    "symbol": "tETH",
    "decimals": 18
  },
  "infoURL": "https://defi-oracle.io/",
  "shortName": "dfio-meta-test",
  "chainId": 2138,
  "networkId": 21,
  "slip44": 60,
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
  "testnet": true,
  "slug": "defi-oracle-meta-testnet"
} as const satisfies Chain;