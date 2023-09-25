import type { Chain } from "../src/types";
export default {
  "chainId": 2206132,
  "chain": "PlatON",
  "name": "PlatON Dev Testnet2",
  "rpc": [
    "https://platon-dev-testnet2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet2openapi.platon.network/rpc",
    "wss://devnet2openapi.platon.network/ws"
  ],
  "slug": "platon-dev-testnet2",
  "icon": {
    "url": "ipfs://QmT7PSXBiVBma6E15hNkivmstqLu3JSnG1jXN5pTmcCGRC",
    "width": 180,
    "height": 180,
    "format": "png"
  },
  "faucets": [
    "https://devnet2faucet.platon.network/faucet"
  ],
  "nativeCurrency": {
    "name": "LAT",
    "symbol": "lat",
    "decimals": 18
  },
  "infoURL": "https://www.platon.network",
  "shortName": "platondev2",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "PlatON explorer",
      "url": "https://devnet2scan.platon.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;