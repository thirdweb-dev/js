import type { Chain } from "../src/types";
export default {
  "chain": "TMY",
  "chainId": 8768,
  "explorers": [],
  "faucets": [
    "https://faucet.tmychain.org/"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://Qmcd19ksUvNMD1XQFSC55jJhDPoF2zUzzV7woteFiugwBH",
    "width": 1024,
    "height": 1023,
    "format": "svg"
  },
  "infoURL": "https://tmychain.org/",
  "name": "TMY Chain",
  "nativeCurrency": {
    "name": "TMY",
    "symbol": "TMY",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://tmy-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.tmyblockchain.org/rpc"
  ],
  "shortName": "tmy",
  "slug": "tmy-chain",
  "testnet": false
} as const satisfies Chain;