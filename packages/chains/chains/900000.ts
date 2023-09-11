import type { Chain } from "../src/types";
export default {
  "name": "Posichain Mainnet Shard 0",
  "chain": "PSC",
  "rpc": [
    "https://posichain-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.posichain.org",
    "https://api.s0.posichain.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Posichain Native Token",
    "symbol": "POSI",
    "decimals": 18
  },
  "infoURL": "https://posichain.org",
  "shortName": "psc-s0",
  "chainId": 900000,
  "networkId": 900000,
  "explorers": [
    {
      "name": "Posichain Explorer",
      "url": "https://explorer.posichain.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "posichain-shard-0"
} as const satisfies Chain;