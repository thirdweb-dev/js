import type { Chain } from "../src/types";
export default {
  "chainId": 21337,
  "chain": "CENNZnet",
  "name": "CENNZnet Azalea",
  "rpc": [
    "https://cennznet-azalea.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cennznet.unfrastructure.io/public"
  ],
  "slug": "cennznet-azalea",
  "icon": {
    "url": "ipfs://QmWhNm7tTi6SYbiumULDRk956hxgqaZSX77vcxBNn8fvnw",
    "width": 112,
    "height": 112,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "CPAY",
    "symbol": "CPAY",
    "decimals": 18
  },
  "infoURL": "https://cennz.net",
  "shortName": "cennz-a",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "UNcover",
      "url": "https://uncoverexplorer.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;