export default {
  "name": "Ennothem Mainnet Proterozoic",
  "chain": "ETMP",
  "rpc": [
    "https://ennothem-proterozoic.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.etm.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ennothem",
    "symbol": "ETMP",
    "decimals": 18
  },
  "infoURL": "https://etm.network",
  "shortName": "etmp",
  "chainId": 48,
  "networkId": 48,
  "icon": {
    "url": "ipfs://QmT7DTqT1V2y42pRpt3sj9ifijfmbtkHN7D2vTfAUAS622",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "etmpscan",
      "url": "https://etmscan.network",
      "icon": "etmp",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "ennothem-proterozoic"
} as const;