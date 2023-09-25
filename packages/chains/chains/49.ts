import type { Chain } from "../src/types";
export default {
  "chainId": 49,
  "chain": "ETMP",
  "name": "Ennothem Testnet Pioneer",
  "rpc": [
    "https://ennothem-testnet-pioneer.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.pioneer.etm.network"
  ],
  "slug": "ennothem-testnet-pioneer",
  "icon": {
    "url": "ipfs://QmT7DTqT1V2y42pRpt3sj9ifijfmbtkHN7D2vTfAUAS622",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ennothem",
    "symbol": "ETMP",
    "decimals": 18
  },
  "infoURL": "https://etm.network",
  "shortName": "etmpTest",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "etmp",
      "url": "https://pioneer.etmscan.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;