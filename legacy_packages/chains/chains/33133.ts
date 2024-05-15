import type { Chain } from "../src/types";
export default {
  "chain": "NGL",
  "chainId": 33133,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmUQiosuH8ib8aXSpYcJRTje9Lro9VeZyd4cNXrXGY5r8D",
    "width": 100,
    "height": 100,
    "format": "svg"
  },
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