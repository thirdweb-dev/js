import type { Chain } from "../types";
export default {
  "chain": "PlatON",
  "chainId": 2206132,
  "explorers": [
    {
      "name": "PlatON explorer",
      "url": "https://devnet2scan.platon.network",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://devnet2faucet.platon.network/faucet"
  ],
  "icon": {
    "url": "ipfs://QmT7PSXBiVBma6E15hNkivmstqLu3JSnG1jXN5pTmcCGRC",
    "width": 180,
    "height": 180,
    "format": "png"
  },
  "infoURL": "https://www.platon.network",
  "name": "PlatON Dev Testnet2",
  "nativeCurrency": {
    "name": "LAT",
    "symbol": "lat",
    "decimals": 18
  },
  "networkId": 1,
  "rpc": [
    "https://platon-dev-testnet2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2206132.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet2openapi.platon.network/rpc",
    "wss://devnet2openapi.platon.network/ws"
  ],
  "shortName": "platondev2",
  "slug": "platon-dev-testnet2",
  "testnet": true
} as const satisfies Chain;