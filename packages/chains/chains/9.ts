import type { Chain } from "../src/types";
export default {
  "name": "Ubiq Network Testnet",
  "chain": "UBQ",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ubiq Testnet Ether",
    "symbol": "TUBQ",
    "decimals": 18
  },
  "infoURL": "https://ethersocial.org",
  "shortName": "tubq",
  "chainId": 9,
  "networkId": 2,
  "testnet": true,
  "slug": "ubiq-network-testnet"
} as const satisfies Chain;