import type { Chain } from "../src/types";
export default {
  "chain": "CENNZnet",
  "chainId": 21337,
  "explorers": [
    {
      "name": "UNcover",
      "url": "https://uncoverexplorer.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWhNm7tTi6SYbiumULDRk956hxgqaZSX77vcxBNn8fvnw",
    "width": 112,
    "height": 112,
    "format": "svg"
  },
  "infoURL": "https://cennz.net",
  "name": "CENNZnet Azalea",
  "nativeCurrency": {
    "name": "CPAY",
    "symbol": "CPAY",
    "decimals": 18
  },
  "networkId": 21337,
  "rpc": [
    "https://cennznet-azalea.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://21337.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cennznet.unfrastructure.io/public"
  ],
  "shortName": "cennz-a",
  "slug": "cennznet-azalea",
  "testnet": false
} as const satisfies Chain;