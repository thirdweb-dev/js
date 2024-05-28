import type { Chain } from "../src/types";
export default {
  "chain": "NGL",
  "chainId": 33133,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.entangle.fi",
  "name": "Entangle Testnet",
  "nativeCurrency": {
    "name": "Entangle",
    "symbol": "NGL",
    "decimals": 18
  },
  "networkId": 33133,
  "rpc": [
    "https://33133.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-testnet.entangle.fi"
  ],
  "shortName": "tngl",
  "slug": "entangle-testnet",
  "testnet": true
} as const satisfies Chain;