import type { Chain } from "../src/types";
export default {
  "chain": "ESN",
  "chainId": 31102,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://ethersocial.org",
  "name": "Ethersocial Network",
  "nativeCurrency": {
    "name": "Ethersocial Network Ether",
    "symbol": "ESN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ethersocial-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.esn.gonspool.com"
  ],
  "shortName": "esn",
  "slug": "ethersocial-network",
  "testnet": false
} as const satisfies Chain;