import type { Chain } from "../src/types";
export default {
  "chainId": 45000,
  "chain": "TXL",
  "name": "Autobahn Network",
  "rpc": [
    "https://autobahn-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.autobahn.network"
  ],
  "slug": "autobahn-network",
  "icon": {
    "url": "ipfs://QmZP19pbqTco4vaP9siduLWP8pdYArFK3onfR55tvjr12s",
    "width": 489,
    "height": 489,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "TXL",
    "symbol": "TXL",
    "decimals": 18
  },
  "infoURL": "https://autobahn.network",
  "shortName": "AutobahnNetwork",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "autobahn explorer",
      "url": "https://explorer.autobahn.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;