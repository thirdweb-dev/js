export default {
  "name": "Numbers Mainnet",
  "chain": "NUM",
  "icon": {
    "url": "ipfs://bafkreie3ba6ofosjqqiya6empkyw6u5xdrtcfzi2evvyt4u6utzeiezyhi",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "rpc": [
    "https://numbers.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnetrpc.num.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "NUM Token",
    "symbol": "NUM",
    "decimals": 18
  },
  "infoURL": "https://numbersprotocol.io",
  "shortName": "Jade",
  "chainId": 10507,
  "networkId": 10507,
  "explorers": [
    {
      "name": "ethernal",
      "url": "https://mainnet.num.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "numbers"
} as const;