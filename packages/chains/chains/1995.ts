export default {
  "name": "edeXa Testnet",
  "chain": "edeXa TestNetwork",
  "rpc": [
    "https://edexa-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.edexa.com/rpc"
  ],
  "faucets": [
    "https://faucet.edexa.com/"
  ],
  "nativeCurrency": {
    "name": "EDEXA",
    "symbol": "EDX",
    "decimals": 18
  },
  "infoURL": "https://edexa.com/",
  "shortName": "edx",
  "chainId": 1995,
  "networkId": 1995,
  "icon": {
    "url": "ipfs://QmSgvmLpRsCiu2ySqyceA5xN4nwi7URJRNEZLffwEKXdoR",
    "width": 1028,
    "height": 1042,
    "format": "png"
  },
  "explorers": [
    {
      "name": "edexa-testnet",
      "url": "https://explorer.edexa.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "edexa-testnet"
} as const;