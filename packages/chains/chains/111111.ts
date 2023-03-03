export default {
  "name": "Siberium Network",
  "chain": "SBR",
  "rpc": [
    "https://siberium-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.main.siberium.net",
    "https://rpc.main.siberium.net.ru"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Siberium",
    "symbol": "SBR",
    "decimals": 18
  },
  "infoURL": "https://siberium.net",
  "shortName": "sbr",
  "chainId": 111111,
  "networkId": 111111,
  "icon": {
    "url": "ipfs://QmVDeoGo2TZPDWiaNDdPCnH2tz2BCQ7viw8ugdDWnU5LFq",
    "width": 1920,
    "height": 1920,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "Siberium Mainnet Explorer - blockscout - 1",
      "url": "https://explorer.main.siberium.net",
      "icon": "siberium",
      "standard": "EIP3091"
    },
    {
      "name": "Siberium Mainnet Explorer - blockscout - 2",
      "url": "https://explorer.main.siberium.net.ru",
      "icon": "siberium",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "siberium-network"
} as const;