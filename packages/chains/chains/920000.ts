import type { Chain } from "../src/types";
export default {
  "chain": "PSC",
  "chainId": 920000,
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
  "name": "Posichain Devnet Shard 0",
  "nativeCurrency": {
    "name": "Posichain Native Token",
    "symbol": "POSI",
    "decimals": 18
  },
  "networkId": 920000,
  "rpc": [
    "https://920000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s0.d.posichain.org"
  ],
  "shortName": "psc-d-s0",
  "slug": "posichain-devnet-shard-0",
  "testnet": false
} as const satisfies Chain;