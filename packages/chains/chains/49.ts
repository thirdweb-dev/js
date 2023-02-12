export default {
  "name": "Ennothem Testnet Pioneer",
  "chain": "ETMP",
  "rpc": [
    "https://ennothem-testnet-pioneer.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.pioneer.etm.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ennothem",
    "symbol": "ETMP",
    "decimals": 18
  },
  "infoURL": "https://etm.network",
  "shortName": "etmpTest",
  "chainId": 49,
  "networkId": 49,
  "icon": {
    "url": "ipfs://QmT7DTqT1V2y42pRpt3sj9ifijfmbtkHN7D2vTfAUAS622",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "etmp",
      "url": "https://pioneer.etmscan.network",
      "icon": "etmpscan",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "ennothem-testnet-pioneer"
} as const;