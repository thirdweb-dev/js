export default {
  "name": "Theta Mainnet",
  "chain": "Theta",
  "rpc": [
    "https://theta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-api.thetatoken.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Theta Fuel",
    "symbol": "TFUEL",
    "decimals": 18
  },
  "infoURL": "https://www.thetatoken.org/",
  "shortName": "theta-mainnet",
  "chainId": 361,
  "networkId": 361,
  "explorers": [
    {
      "name": "Theta Mainnet Explorer",
      "url": "https://explorer.thetatoken.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "theta"
} as const;