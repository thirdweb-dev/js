import type { Chain } from "../types";
export default {
  "chain": "PSC",
  "chainId": 920001,
  "explorers": [
    {
      "name": "Posichain Explorer Devnet",
      "url": "https://explorer-devnet.posichain.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.posichain.org/"
  ],
  "infoURL": "https://posichain.org",
  "name": "Posichain Devnet Shard 1",
  "nativeCurrency": {
    "name": "Posichain Native Token",
    "symbol": "POSI",
    "decimals": 18
  },
  "networkId": 920001,
  "rpc": [
    "https://posichain-devnet-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://920001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s1.d.posichain.org"
  ],
  "shortName": "psc-d-s1",
  "slug": "posichain-devnet-shard-1",
  "testnet": false
} as const satisfies Chain;