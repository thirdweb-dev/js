export default {
  "name": "Canto Testnet",
  "chain": "Canto Tesnet",
  "rpc": [
    "https://canto-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth.plexnode.wtf/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Canto",
    "symbol": "CANTO",
    "decimals": 18
  },
  "infoURL": "https://canto.io",
  "shortName": "tcanto",
  "chainId": 740,
  "networkId": 740,
  "explorers": [
    {
      "name": "Canto Tesnet Explorer (Neobase)",
      "url": "http://testnet-explorer.canto.neobase.one",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "canto-testnet"
} as const;