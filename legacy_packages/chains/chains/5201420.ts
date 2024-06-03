import type { Chain } from "../src/types";
export default {
  "chain": "Electroneum",
  "chainId": 5201420,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockexplorer.thesecurityteam.rocks",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://electroneum.com",
  "name": "Electroneum Testnet",
  "nativeCurrency": {
    "name": "Electroneum",
    "symbol": "ETN",
    "decimals": 18
  },
  "networkId": 5201420,
  "rpc": [
    "https://5201420.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.electroneum.com"
  ],
  "shortName": "etn-testnet",
  "slip44": 1,
  "slug": "electroneum-testnet",
  "testnet": true
} as const satisfies Chain;