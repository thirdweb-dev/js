export default {
  "name": "Theta Amber Testnet",
  "chain": "Theta",
  "rpc": [
    "https://theta-amber-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-api-amber.thetatoken.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Theta Fuel",
    "symbol": "TFUEL",
    "decimals": 18
  },
  "infoURL": "https://www.thetatoken.org/",
  "shortName": "theta-amber",
  "chainId": 364,
  "networkId": 364,
  "explorers": [
    {
      "name": "Theta Amber Testnet Explorer",
      "url": "https://guardian-testnet-amber-explorer.thetatoken.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "theta-amber-testnet"
} as const;