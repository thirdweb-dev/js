import type { Chain } from "../src/types";
export default {
  "chain": "CENNZnet",
  "chainId": 3001,
  "explorers": [
    {
      "name": "UNcover",
      "url": "https://www.uncoverexplorer.com/?network=Nikau",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://app-faucet.centrality.me"
  ],
  "icon": {
    "url": "ipfs://QmWhNm7tTi6SYbiumULDRk956hxgqaZSX77vcxBNn8fvnw",
    "width": 112,
    "height": 112,
    "format": "svg"
  },
  "infoURL": "https://cennz.net",
  "name": "CENNZnet Nikau",
  "nativeCurrency": {
    "name": "CPAY",
    "symbol": "CPAY",
    "decimals": 18
  },
  "networkId": 3001,
  "rpc": [
    "https://cennznet-nikau.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nikau.centrality.me/public"
  ],
  "shortName": "cennz-n",
  "slug": "cennznet-nikau",
  "testnet": false
} as const satisfies Chain;