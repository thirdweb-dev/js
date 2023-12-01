import type { Chain } from "../src/types";
export default {
  "chain": "Roll",
  "chainId": 1748,
  "explorers": [],
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
  "rpc": [
    "https://roll-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1748.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://roll.calderachain.xyz/http"
  ],
  "shortName": "Roll",
  "slug": "roll-testnet",
  "testnet": true,
  "title": "Roll Testnet"
} as const satisfies Chain;