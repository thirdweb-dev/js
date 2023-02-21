export default {
  "name": "Theta Testnet",
  "chain": "Theta",
  "rpc": [
    "https://theta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-api-testnet.thetatoken.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Theta Fuel",
    "symbol": "TFUEL",
    "decimals": 18
  },
  "infoURL": "https://www.thetatoken.org/",
  "shortName": "theta-testnet",
  "chainId": 365,
  "networkId": 365,
  "explorers": [
    {
      "name": "Theta Testnet Explorer",
      "url": "https://testnet-explorer.thetatoken.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "theta-testnet"
} as const;