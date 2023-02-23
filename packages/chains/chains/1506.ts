export default {
  "name": "Sherpax Mainnet",
  "chain": "Sherpax Mainnet",
  "rpc": [
    "https://sherpax.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.sherpax.io/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "KSX",
    "symbol": "KSX",
    "decimals": 18
  },
  "infoURL": "https://sherpax.io/",
  "shortName": "Sherpax",
  "chainId": 1506,
  "networkId": 1506,
  "explorers": [
    {
      "name": "Sherpax Mainnet Explorer",
      "url": "https://evm.sherpax.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "sherpax"
} as const;