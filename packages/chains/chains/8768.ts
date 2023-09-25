import type { Chain } from "../src/types";
export default {
  "chainId": 8768,
  "chain": "TMY",
  "name": "TMY Chain",
  "rpc": [
    "https://tmy-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.tmyblockchain.org/rpc"
  ],
  "slug": "tmy-chain",
  "icon": {
    "url": "ipfs://Qmcd19ksUvNMD1XQFSC55jJhDPoF2zUzzV7woteFiugwBH",
    "width": 1024,
    "height": 1023,
    "format": "svg"
  },
  "faucets": [
    "https://faucet.tmychain.org/"
  ],
  "nativeCurrency": {
    "name": "TMY",
    "symbol": "TMY",
    "decimals": 18
  },
  "infoURL": "https://tmychain.org/",
  "shortName": "tmy",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;