export default {
  "name": "Sherpax Testnet",
  "chain": "Sherpax Testnet",
  "rpc": [
    "https://sherpax-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sherpax-testnet.chainx.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "KSX",
    "symbol": "KSX",
    "decimals": 18
  },
  "infoURL": "https://sherpax.io/",
  "shortName": "SherpaxTestnet",
  "chainId": 1507,
  "networkId": 1507,
  "explorers": [
    {
      "name": "Sherpax Testnet Explorer",
      "url": "https://evm-pre.sherpax.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "sherpax-testnet"
} as const;