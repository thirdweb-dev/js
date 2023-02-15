export default {
  "name": "Smart Host Teknoloji TESTNET",
  "chain": "SHT",
  "rpc": [
    "https://smart-host-teknoloji-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s2.tl.web.tr:4041"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Smart Host Teknoloji TESTNET",
    "symbol": "tSHT",
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
  "infoURL": "https://smart-host.com.tr",
  "shortName": "sht",
  "chainId": 1177,
  "networkId": 1177,
  "icon": {
    "url": "ipfs://QmTrLGHyQ1Le25Q7EgNSF5Qq8D2SocKvroDkLqurdBuSQQ",
    "width": 1655,
    "height": 1029,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Smart Host Teknoloji TESTNET Explorer",
      "url": "https://s2.tl.web.tr:4000",
      "icon": "smarthost",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "smart-host-teknoloji-testnet"
} as const;