export default {
  "name": "BOMB Chain",
  "chain": "BOMB",
  "rpc": [
    "https://bomb-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bombchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BOMB Token",
    "symbol": "BOMB",
    "decimals": 18
  },
  "infoURL": "https://www.bombchain.com",
  "shortName": "bomb",
  "chainId": 2300,
  "networkId": 2300,
  "icon": {
    "url": "ipfs://Qmc44uSjfdNHdcxPTgZAL8eZ8TLe4UmSHibcvKQFyGJxTB",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "explorers": [
    {
      "name": "bombscan",
      "icon": "bomb",
      "url": "https://bombscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "bomb-chain"
} as const;