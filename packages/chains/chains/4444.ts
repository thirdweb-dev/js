import type { Chain } from "../src/types";
export default {
  "chainId": 4444,
  "chain": "mainnet",
  "name": "Htmlcoin Mainnet",
  "rpc": [
    "https://htmlcoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://janus.htmlcoin.com/api/"
  ],
  "slug": "htmlcoin",
  "icon": {
    "url": "ipfs://QmR1oDRSadPerfyWMhKHNP268vPKvpczt5zPawgFSZisz2",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "faucets": [
    "https://gruvin.me/htmlcoin"
  ],
  "nativeCurrency": {
    "name": "Htmlcoin",
    "symbol": "HTML",
    "decimals": 8
  },
  "infoURL": "https://htmlcoin.com",
  "shortName": "html",
  "testnet": false,
  "status": "active",
  "redFlags": [],
  "explorers": [
    {
      "name": "htmlcoin",
      "url": "https://explorer.htmlcoin.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;