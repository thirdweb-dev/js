export default {
  "name": "Numbers Testnet",
  "chain": "NUM",
  "icon": {
    "url": "ipfs://bafkreie3ba6ofosjqqiya6empkyw6u5xdrtcfzi2evvyt4u6utzeiezyhi",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "rpc": [
    "https://numbers-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnetrpc.num.network"
  ],
  "faucets": [
    "https://faucet.avax.network/?subnet=num",
    "https://faucet.num.network"
  ],
  "nativeCurrency": {
    "name": "NUM Token",
    "symbol": "NUM",
    "decimals": 18
  },
  "infoURL": "https://numbersprotocol.io",
  "shortName": "Snow",
  "chainId": 10508,
  "networkId": 10508,
  "explorers": [
    {
      "name": "ethernal",
      "url": "https://testnet.num.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "numbers-testnet"
} as const;