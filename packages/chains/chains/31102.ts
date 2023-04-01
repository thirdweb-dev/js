import type { Chain } from "../src/types";
export default {
  "name": "Ethersocial Network",
  "chain": "ESN",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ethersocial Network Ether",
    "symbol": "ESN",
    "decimals": 18
  },
  "infoURL": "https://ethersocial.org",
  "shortName": "esn",
  "chainId": 31102,
  "networkId": 1,
  "slip44": 31102,
  "testnet": false,
  "slug": "ethersocial-network"
} as const satisfies Chain;