import type { Chain } from "../src/types";
export default {
  "chain": "CENNZnet",
  "chainId": 3000,
  "explorers": [],
  "faucets": [
    "https://app-faucet.centrality.me"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmWhNm7tTi6SYbiumULDRk956hxgqaZSX77vcxBNn8fvnw",
    "width": 112,
    "height": 112,
    "format": "svg"
  },
  "infoURL": "https://cennz.net",
  "name": "CENNZnet Rata",
  "nativeCurrency": {
    "name": "CPAY",
    "symbol": "CPAY",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "cennz-r",
  "slug": "cennznet-rata",
  "testnet": false
} as const satisfies Chain;