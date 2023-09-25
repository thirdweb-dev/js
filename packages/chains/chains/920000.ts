import type { Chain } from "../src/types";
export default {
  "chainId": 920000,
  "chain": "PSC",
  "name": "Posichain Devnet Shard 0",
  "rpc": [
    "https://posichain-devnet-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s0.d.posichain.org"
  ],
  "slug": "posichain-devnet-shard-0",
  "faucets": [
    "https://faucet.posichain.org/"
  ],
  "nativeCurrency": {
    "name": "Posichain Native Token",
    "symbol": "POSI",
    "decimals": 18
  },
  "infoURL": "https://posichain.org",
  "shortName": "psc-d-s0",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Posichain Explorer Devnet",
      "url": "https://explorer-devnet.posichain.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;