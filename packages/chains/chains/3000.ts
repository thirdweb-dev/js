import type { Chain } from "../src/types";
export default {
  "chainId": 3000,
  "chain": "CENNZnet",
  "name": "CENNZnet Rata",
  "rpc": [],
  "slug": "cennznet-rata",
  "icon": {
    "url": "ipfs://QmWhNm7tTi6SYbiumULDRk956hxgqaZSX77vcxBNn8fvnw",
    "width": 112,
    "height": 112,
    "format": "svg"
  },
  "faucets": [
    "https://app-faucet.centrality.me"
  ],
  "nativeCurrency": {
    "name": "CPAY",
    "symbol": "CPAY",
    "decimals": 18
  },
  "infoURL": "https://cennz.net",
  "shortName": "cennz-r",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;