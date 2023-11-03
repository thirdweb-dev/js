import type { Chain } from "../types";
export default {
  "chain": "PSC",
  "chainId": 910000,
  "explorers": [
    {
      "name": "Posichain Explorer Testnet",
      "url": "https://explorer-testnet.posichain.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.posichain.org/"
  ],
  "infoURL": "https://posichain.org",
  "name": "Posichain Testnet Shard 0",
  "nativeCurrency": {
    "name": "Posichain Native Token",
    "symbol": "POSI",
    "decimals": 18
  },
  "networkId": 910000,
  "rpc": [
    "https://posichain-testnet-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://910000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s0.t.posichain.org"
  ],
  "shortName": "psc-t-s0",
  "slug": "posichain-testnet-shard-0",
  "testnet": true
} as const satisfies Chain;