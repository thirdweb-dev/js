import type { Chain } from "../src/types";
export default {
  "chain": "Berachain",
  "chainId": 80085,
  "explorers": [],
  "faucets": [
    "https://artio.faucet.berachain.com/"
  ],
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
  "rpc": [],
  "shortName": "bera-artio",
  "slug": "berachain-artio",
  "testnet": true
} as const satisfies Chain;