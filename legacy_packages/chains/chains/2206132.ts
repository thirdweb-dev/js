import type { Chain } from "../src/types";
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
  "infoURL": "https://www.platon.network",
  "name": "PlatON Dev Testnet2",
  "nativeCurrency": {
    "name": "LAT",
    "symbol": "lat",
    "decimals": 18
  },
  "networkId": 1,
  "rpc": [
    "https://2206132.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet2openapi.platon.network/rpc",
    "wss://devnet2openapi.platon.network/ws"
  ],
  "shortName": "platondev2",
  "slip44": 1,
  "slug": "platon-dev-testnet2",
  "testnet": true
} as const satisfies Chain;