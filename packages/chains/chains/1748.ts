import type { Chain } from "../src/types";
export default {
  "chain": "Roll",
  "chainId": 1748,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://roll.calderaexplorer.xyz/",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmSNKW3HsFekHrTdgt7aAukExwYeYzHZEbG49ZDLYRfkKV/roll_logo%20-%20Ellie%20Li.png",
    "width": 3600,
    "height": 3600,
    "format": ".png"
  },
  "infoURL": "https://tryroll.com/",
  "name": "Roll Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1748,
  "redFlags": [],
  "rpc": [],
  "shortName": "Roll",
  "slug": "roll-testnet",
  "testnet": true,
  "title": "Roll Testnet"
} as const satisfies Chain;