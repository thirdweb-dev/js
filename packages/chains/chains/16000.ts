import type { Chain } from "../src/types";
export default {
  "chain": "MTT",
  "chainId": 16000,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://metadot.network",
  "name": "MetaDot Mainnet",
  "nativeCurrency": {
    "name": "MetaDot Token",
    "symbol": "MTT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://metadot.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.metadot.network"
  ],
  "shortName": "mtt",
  "slug": "metadot",
  "testnet": false
} as const satisfies Chain;