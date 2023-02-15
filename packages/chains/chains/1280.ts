export default {
  "name": "HALO Mainnet",
  "chain": "HALO",
  "rpc": [
    "https://halo.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nodes.halo.land"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "HALO",
    "symbol": "HO",
    "decimals": 18
  },
  "infoURL": "https://halo.land/#/",
  "shortName": "HO",
  "chainId": 1280,
  "networkId": 1280,
  "explorers": [
    {
      "name": "HALOexplorer",
      "url": "https://browser.halo.land",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "halo"
} as const;