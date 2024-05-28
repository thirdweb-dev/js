import type { Chain } from "../src/types";
export default {
  "chain": "mainnet",
  "chainId": 4444,
  "explorers": [
    {
      "name": "htmlcoin",
      "url": "https://explorer.htmlcoin.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmR1oDRSadPerfyWMhKHNP268vPKvpczt5zPawgFSZisz2",
        "width": 1000,
        "height": 1000,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://gruvin.me/htmlcoin"
  ],
  "icon": {
    "url": "ipfs://QmR1oDRSadPerfyWMhKHNP268vPKvpczt5zPawgFSZisz2",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://htmlcoin.com",
  "name": "Htmlcoin Mainnet",
  "nativeCurrency": {
    "name": "Htmlcoin",
    "symbol": "HTML",
    "decimals": 8
  },
  "networkId": 4444,
  "rpc": [
    "https://4444.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://janus.htmlcoin.com/api/"
  ],
  "shortName": "html",
  "slug": "htmlcoin",
  "status": "active",
  "testnet": false
} as const satisfies Chain;