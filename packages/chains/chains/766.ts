export default {
  "name": "QL1",
  "chain": "QOM",
  "status": "incubating",
  "rpc": [
    "https://ql1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.qom.one"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Shiba Predator",
    "symbol": "QOM",
    "decimals": 18
  },
  "infoURL": "https://qom.one",
  "shortName": "qom",
  "chainId": 766,
  "networkId": 766,
  "icon": {
    "url": "ipfs://QmRc1kJ7AgcDL1BSoMYudatWHTrz27K6WNTwGifQb5V17D",
    "width": 518,
    "height": 518,
    "format": "png"
  },
  "explorers": [
    {
      "name": "QL1 Mainnet Explorer",
      "url": "https://mainnet.qom.one",
      "icon": "qom",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "ql1"
} as const;