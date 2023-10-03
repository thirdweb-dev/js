import type { Chain } from "../src/types";
export default {
  "chain": "PlatON",
  "chainId": 210425,
  "explorers": [
    {
      "name": "PlatON explorer",
      "url": "https://scan.platon.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmT7PSXBiVBma6E15hNkivmstqLu3JSnG1jXN5pTmcCGRC",
    "width": 180,
    "height": 180,
    "format": "png"
  },
  "infoURL": "https://www.platon.network",
  "name": "PlatON Mainnet",
  "nativeCurrency": {
    "name": "LAT",
    "symbol": "lat",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://platon.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://openapi2.platon.network/rpc",
    "wss://openapi2.platon.network/ws"
  ],
  "shortName": "platon",
  "slug": "platon",
  "testnet": false
} as const satisfies Chain;