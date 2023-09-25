import type { Chain } from "../src/types";
export default {
  "chainId": 910000,
  "chain": "PSC",
  "name": "Posichain Testnet Shard 0",
  "rpc": [
    "https://posichain-testnet-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s0.t.posichain.org"
  ],
  "slug": "posichain-testnet-shard-0",
  "faucets": [
    "https://faucet.posichain.org/"
  ],
  "nativeCurrency": {
    "name": "Posichain Native Token",
    "symbol": "POSI",
    "decimals": 18
  },
  "infoURL": "https://posichain.org",
  "shortName": "psc-t-s0",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Posichain Explorer Testnet",
      "url": "https://explorer-testnet.posichain.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;