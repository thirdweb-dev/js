import type { Chain } from "../src/types";
export default {
  "chain": "ETMP",
  "chainId": 48,
  "explorers": [
    {
      "name": "etmpscan",
      "url": "https://etmscan.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmT7DTqT1V2y42pRpt3sj9ifijfmbtkHN7D2vTfAUAS622",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://etm.network",
  "name": "Ennothem Mainnet Proterozoic",
  "nativeCurrency": {
    "name": "Ennothem",
    "symbol": "ETMP",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ennothem-proterozoic.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.etm.network"
  ],
  "shortName": "etmp",
  "slug": "ennothem-proterozoic",
  "testnet": false
} as const satisfies Chain;