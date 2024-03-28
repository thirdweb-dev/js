import type { Chain } from "../src/types";
export default {
  "chain": "ESN",
  "chainId": 31102,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://ethersocial.org",
  "name": "Ethersocial Network",
  "nativeCurrency": {
    "name": "Ethersocial Network Ether",
    "symbol": "ESN",
    "decimals": 18
  },
  "networkId": 1,
  "rpc": [
    "https://31102.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.esn.gonspool.com"
  ],
  "shortName": "esn",
  "slip44": 31102,
  "slug": "ethersocial-network",
  "testnet": false
} as const satisfies Chain;