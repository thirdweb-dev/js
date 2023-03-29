export default {
  "name": "Q Testnet",
  "chain": "Q",
  "rpc": [
    "https://q-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.qtestnet.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Q token",
    "symbol": "Q",
    "decimals": 18
  },
  "infoURL": "https://q.org/",
  "shortName": "q-testnet",
  "chainId": 35443,
  "networkId": 35443,
  "icon": {
    "url": "ipfs://QmQUQKe8VEtSthhgXnJ3EmEz94YhpVCpUDZAiU9KYyNLya",
    "width": 585,
    "height": 603,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Q explorer",
      "url": "https://explorer.qtestnet.org",
      "icon": "q",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "q-testnet"
} as const;