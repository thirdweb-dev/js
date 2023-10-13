import type { Chain } from "../src/types";
export default {
  "chain": "PSC",
  "chainId": 900000,
  "explorers": [
    {
      "name": "Posichain Explorer",
      "url": "https://explorer.posichain.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://posichain.org",
  "name": "Posichain Mainnet Shard 0",
  "nativeCurrency": {
    "name": "Posichain Native Token",
    "symbol": "POSI",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://posichain-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.posichain.org",
    "https://api.s0.posichain.org"
  ],
  "shortName": "psc-s0",
  "slug": "posichain-shard-0",
  "testnet": false
} as const satisfies Chain;