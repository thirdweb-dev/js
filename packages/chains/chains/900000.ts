import type { Chain } from "../src/types";
export default {
  "chainId": 900000,
  "chain": "PSC",
  "name": "Posichain Mainnet Shard 0",
  "rpc": [
    "https://posichain-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.posichain.org",
    "https://api.s0.posichain.org"
  ],
  "slug": "posichain-shard-0",
  "faucets": [],
  "nativeCurrency": {
    "name": "Posichain Native Token",
    "symbol": "POSI",
    "decimals": 18
  },
  "infoURL": "https://posichain.org",
  "shortName": "psc-s0",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Posichain Explorer",
      "url": "https://explorer.posichain.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;