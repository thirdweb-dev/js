import type { Chain } from "../src/types";
export default {
  "chainId": 16000,
  "chain": "MTT",
  "name": "MetaDot Mainnet",
  "rpc": [
    "https://metadot.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.metadot.network"
  ],
  "slug": "metadot",
  "faucets": [],
  "nativeCurrency": {
    "name": "MetaDot Token",
    "symbol": "MTT",
    "decimals": 18
  },
  "infoURL": "https://metadot.network",
  "shortName": "mtt",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;