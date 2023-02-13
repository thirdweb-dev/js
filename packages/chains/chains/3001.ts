export default {
  "name": "CENNZnet Nikau",
  "chain": "CENNZnet",
  "rpc": [
    "https://cennznet-nikau.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nikau.centrality.me/public"
  ],
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
  "chainId": 3001,
  "networkId": 3001,
  "icon": {
    "url": "ipfs://QmWhNm7tTi6SYbiumULDRk956hxgqaZSX77vcxBNn8fvnw",
    "width": 112,
    "height": 112,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "UNcover",
      "url": "https://www.uncoverexplorer.com/?network=Nikau",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "cennznet-nikau"
} as const;