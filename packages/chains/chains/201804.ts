export default {
  "name": "Mythical Chain",
  "chain": "MYTH",
  "rpc": [
    "https://mythical-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain-rpc.mythicalgames.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Mythos",
    "symbol": "MYTH",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://mythicalgames.com/",
  "shortName": "myth",
  "chainId": 201804,
  "networkId": 201804,
  "icon": {
    "url": "ipfs://bafkreihru6cccfblrjz5bv36znq2l3h67u6xj5ivtc4bj5l6gzofbgtnb4",
    "width": 350,
    "height": 350,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Mythical Chain Explorer",
      "url": "https://explorer.mythicalgames.com",
      "icon": "mythical",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "mythical-chain"
} as const;