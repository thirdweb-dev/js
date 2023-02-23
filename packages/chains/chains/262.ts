export default {
  "name": "SUR Blockchain Network",
  "chain": "SUR",
  "rpc": [
    "https://sur-blockchain-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sur.nilin.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Suren",
    "symbol": "SRN",
    "decimals": 18
  },
  "infoURL": "https://surnet.org",
  "shortName": "SUR",
  "chainId": 262,
  "networkId": 1,
  "icon": {
    "url": "ipfs://QmbUcDQHCvheYQrWk9WFJRMW5fTJQmtZqkoGUed4bhCM7T",
    "width": 3000,
    "height": 3000,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Surnet Explorer",
      "url": "https://explorer.surnet.org",
      "icon": "SUR",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "sur-blockchain-network"
} as const;