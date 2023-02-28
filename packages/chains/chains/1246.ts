export default {
  "name": "OM Platform Mainnet",
  "chain": "omplatform",
  "rpc": [
    "https://om-platform.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-cnx.omplatform.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OMCOIN",
    "symbol": "OM",
    "decimals": 18
  },
  "infoURL": "https://omplatform.com/",
  "shortName": "om",
  "chainId": 1246,
  "networkId": 1246,
  "explorers": [
    {
      "name": "OMSCAN - Expenter",
      "url": "https://omscan.omplatform.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "om-platform"
} as const;