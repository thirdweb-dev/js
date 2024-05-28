import type { Chain } from "../src/types";
export default {
  "chain": "SPENT",
  "chainId": 9911,
  "explorers": [
    {
      "name": "escscan",
      "url": "https://escscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmVvQdmAj6GNQjP1dsxQKbA7xgzqsciooGTQtQ2RsJ37Lf",
        "width": 335,
        "height": 335,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmVvQdmAj6GNQjP1dsxQKbA7xgzqsciooGTQtQ2RsJ37Lf",
    "width": 335,
    "height": 335,
    "format": "svg"
  },
  "infoURL": "https://espento.network",
  "name": "Espento Mainnet",
  "nativeCurrency": {
    "name": "ESPENTO",
    "symbol": "SPENT",
    "decimals": 18
  },
  "networkId": 9911,
  "rpc": [
    "https://9911.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.escscan.com/"
  ],
  "shortName": "spent",
  "slug": "espento",
  "testnet": false
} as const satisfies Chain;