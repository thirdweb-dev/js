import type { Chain } from "../src/types";
export default {
  "chain": "TXL",
  "chainId": 45000,
  "explorers": [
    {
      "name": "autobahn explorer",
      "url": "https://explorer.autobahn.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmZP19pbqTco4vaP9siduLWP8pdYArFK3onfR55tvjr12s",
        "width": 489,
        "height": 489,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZP19pbqTco4vaP9siduLWP8pdYArFK3onfR55tvjr12s",
    "width": 489,
    "height": 489,
    "format": "png"
  },
  "infoURL": "https://autobahn.network",
  "name": "Autobahn Network",
  "nativeCurrency": {
    "name": "TXL",
    "symbol": "TXL",
    "decimals": 18
  },
  "networkId": 45000,
  "rpc": [
    "https://autobahn-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://45000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.autobahn.network"
  ],
  "shortName": "AutobahnNetwork",
  "slug": "autobahn-network",
  "testnet": false
} as const satisfies Chain;