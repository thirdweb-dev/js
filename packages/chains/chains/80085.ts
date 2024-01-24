import type { Chain } from "../src/types";
export default {
  "chain": "Berachain",
  "chainId": 80085,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.berachain.com/",
  "name": "Berachain Artio",
  "nativeCurrency": {
    "name": "BERA",
    "symbol": "BERA",
    "decimals": 18
  },
  "networkId": 80085,
  "redFlags": [],
  "rpc": [
    "https://berachain-artio.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://80085.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://artio.rpc.berachain.com/"
  ],
  "shortName": "bera-artio",
  "slug": "berachain-artio",
  "testnet": true
} as const satisfies Chain;