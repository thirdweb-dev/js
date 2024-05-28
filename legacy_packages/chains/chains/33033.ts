import type { Chain } from "../src/types";
export default {
  "chain": "NGL",
  "chainId": 33033,
  "explorers": [
    {
      "name": "Entangle Mainnet Explorer",
      "url": "https://explorer.entangle.fi",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmUQiosuH8ib8aXSpYcJRTje9Lro9VeZyd4cNXrXGY5r8D",
    "width": 100,
    "height": 100,
    "format": "svg"
  },
  "infoURL": "https://www.entangle.fi",
  "name": "Entangle Mainnet",
  "nativeCurrency": {
    "name": "Entangle",
    "symbol": "NGL",
    "decimals": 18
  },
  "networkId": 33033,
  "rpc": [
    "https://33033.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.entangle.fi"
  ],
  "shortName": "ngl",
  "slug": "entangle",
  "testnet": false
} as const satisfies Chain;