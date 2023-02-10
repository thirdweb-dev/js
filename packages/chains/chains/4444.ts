export default {
  "name": "Htmlcoin Mainnet",
  "chain": "mainnet",
  "rpc": [
    "https://janus.htmlcoin.com/api/"
  ],
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
  "chainId": 4444,
  "networkId": 4444,
  "icon": {
    "url": "ipfs://QmR1oDRSadPerfyWMhKHNP268vPKvpczt5zPawgFSZisz2",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "status": "active",
  "explorers": [
    {
      "name": "htmlcoin",
      "url": "https://explorer.htmlcoin.com",
      "icon": "htmlcoin",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "htmlcoin"
} as const;