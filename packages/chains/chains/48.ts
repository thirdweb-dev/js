import type { Chain } from "../src/types";
export default {
  "chainId": 48,
  "chain": "ETMP",
  "name": "Ennothem Mainnet Proterozoic",
  "rpc": [
    "https://ennothem-proterozoic.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.etm.network"
  ],
  "slug": "ennothem-proterozoic",
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
  "shortName": "etmp",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "etmpscan",
      "url": "https://etmscan.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;