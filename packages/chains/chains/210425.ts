import type { Chain } from "../src/types";
export default {
  "chainId": 210425,
  "chain": "PlatON",
  "name": "PlatON Mainnet",
  "rpc": [
    "https://platon.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://openapi2.platon.network/rpc",
    "wss://openapi2.platon.network/ws"
  ],
  "slug": "platon",
  "icon": {
    "url": "ipfs://QmT7PSXBiVBma6E15hNkivmstqLu3JSnG1jXN5pTmcCGRC",
    "width": 180,
    "height": 180,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "LAT",
    "symbol": "lat",
    "decimals": 18
  },
  "infoURL": "https://www.platon.network",
  "shortName": "platon",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "PlatON explorer",
      "url": "https://scan.platon.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;