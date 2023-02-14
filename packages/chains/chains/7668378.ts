export default {
  "name": "QL1 Testnet",
  "chain": "QOM",
  "status": "incubating",
  "rpc": [
    "https://ql1-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.qom.one"
  ],
  "faucets": [
    "https://faucet.qom.one"
  ],
  "nativeCurrency": {
    "name": "Shiba Predator",
    "symbol": "QOM",
    "decimals": 18
  },
  "infoURL": "https://qom.one",
  "shortName": "tqom",
  "chainId": 7668378,
  "networkId": 7668378,
  "icon": {
    "url": "ipfs://QmRc1kJ7AgcDL1BSoMYudatWHTrz27K6WNTwGifQb5V17D",
    "width": 518,
    "height": 518,
    "format": "png"
  },
  "explorers": [
    {
      "name": "QL1 Testnet Explorer",
      "url": "https://testnet.qom.one",
      "icon": "qom",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "ql1-testnet"
} as const;