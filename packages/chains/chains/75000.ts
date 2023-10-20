import type { Chain } from "../src/types";
export default {
  "chain": "RESIN",
  "chainId": 75000,
  "explorers": [
    {
      "name": "ResinScan",
      "url": "https://explorer.resincoin.dev",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTBszPzBeWPhjozf4TxpL2ws1NkG9yJvisx9h6MFii1zb",
    "width": 460,
    "height": 460,
    "format": "png"
  },
  "infoURL": "https://resincoin.dev",
  "name": "ResinCoin Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "RESIN",
    "decimals": 18
  },
  "networkId": 75000,
  "rpc": [],
  "shortName": "resin",
  "slug": "resincoin",
  "testnet": false
} as const satisfies Chain;