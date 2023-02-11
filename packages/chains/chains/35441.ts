export default {
  "name": "Q Mainnet",
  "chain": "Q",
  "rpc": [
    "https://q.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.q.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Q token",
    "symbol": "Q",
    "decimals": 18
  },
  "infoURL": "https://q.org",
  "shortName": "q",
  "chainId": 35441,
  "networkId": 35441,
  "icon": {
    "url": "ipfs://QmQUQKe8VEtSthhgXnJ3EmEz94YhpVCpUDZAiU9KYyNLya",
    "width": 585,
    "height": 603,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Q explorer",
      "url": "https://explorer.q.org",
      "icon": "q",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "q"
} as const;