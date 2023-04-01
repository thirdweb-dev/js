import type { Chain } from "../src/types";
export default {
  "name": "Posichain Devnet Shard 1",
  "chain": "PSC",
  "rpc": [],
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
  "chainId": 920001,
  "networkId": 920001,
  "explorers": [
    {
      "name": "Posichain Explorer Devnet",
      "url": "https://explorer-devnet.posichain.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "posichain-devnet-shard-1"
} as const satisfies Chain;