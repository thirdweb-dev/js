import type { Chain } from "../src/types";
export default {
  "chainId": 3001,
  "chain": "CENNZnet",
  "name": "CENNZnet Nikau",
  "rpc": [
    "https://cennznet-nikau.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nikau.centrality.me/public"
  ],
  "slug": "cennznet-nikau",
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
  "shortName": "cennz-n",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "UNcover",
      "url": "https://www.uncoverexplorer.com/?network=Nikau",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;