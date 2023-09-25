import type { Chain } from "../src/types";
export default {
  "chainId": 31102,
  "chain": "ESN",
  "name": "Ethersocial Network",
  "rpc": [
    "https://ethersocial-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.esn.gonspool.com"
  ],
  "slug": "ethersocial-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ethersocial Network Ether",
    "symbol": "ESN",
    "decimals": 18
  },
  "infoURL": "https://ethersocial.org",
  "shortName": "esn",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;