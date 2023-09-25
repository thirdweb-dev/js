import type { Chain } from "../src/types";
export default {
  "chainId": 920001,
  "chain": "PSC",
  "name": "Posichain Devnet Shard 1",
  "rpc": [
    "https://posichain-devnet-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s1.d.posichain.org"
  ],
  "slug": "posichain-devnet-shard-1",
  "faucets": [
    "https://faucet.posichain.org/"
  ],
  "nativeCurrency": {
    "name": "Posichain Native Token",
    "symbol": "POSI",
    "decimals": 18
  },
  "infoURL": "https://posichain.org",
  "shortName": "psc-d-s1",
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