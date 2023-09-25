import type { Chain } from "../src/types";
export default {
  "chainId": 9,
  "chain": "UBQ",
  "name": "Ubiq Network Testnet",
  "rpc": [],
  "slug": "ubiq-network-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ubiq Testnet Ether",
    "symbol": "TUBQ",
    "decimals": 18
  },
  "infoURL": "https://ethersocial.org",
  "shortName": "tubq",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;