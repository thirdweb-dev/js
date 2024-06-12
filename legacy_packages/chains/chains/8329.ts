import type { Chain } from "../src/types";
export default {
  "chain": "Lorenzo",
  "chainId": 8329,
  "explorers": [
    {
      "name": "Lorenzo Explorer",
      "url": "https://scan.lorenzo-protocol.xyz",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmcwDCeZpzvRWBwtTgyEFv4tLJk6SFUb26rwsRXyJrhnP7",
        "width": 288,
        "height": 288,
        "format": "png"
      }
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
  "icon": {
    "url": "ipfs://QmcwDCeZpzvRWBwtTgyEFv4tLJk6SFUb26rwsRXyJrhnP7",
    "width": 288,
    "height": 288,
    "format": "png"
  },
  "infoURL": "https://www.lorenzo-protocol.xyz/",
  "name": "Lorenzo",
  "nativeCurrency": {
    "name": "Lorenzo stBTC",
    "symbol": "stBTC",
    "decimals": 18
  },
  "networkId": 8329,
  "rpc": [
    "https://8329.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.lorenzo-protocol.xyz"
  ],
  "shortName": "lrz",
  "slug": "lorenzo",
  "testnet": false
} as const satisfies Chain;