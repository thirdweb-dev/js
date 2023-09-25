import type { Chain } from "../src/types";
export default {
  "chainId": 75000,
  "chain": "RESIN",
  "name": "ResinCoin Mainnet",
  "rpc": [],
  "slug": "resincoin",
  "icon": {
    "url": "ipfs://QmTBszPzBeWPhjozf4TxpL2ws1NkG9yJvisx9h6MFii1zb",
    "width": 460,
    "height": 460,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://resincoin.dev",
  "shortName": "resin",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "ResinScan",
      "url": "https://explorer.resincoin.dev",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;