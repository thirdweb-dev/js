import type { Chain } from "../src/types";
export default {
  "chain": "AIR",
  "chainId": 2088,
  "explorers": [],
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
    "url": "ipfs://QmSwqWxZ5HRdc25HMhEmVKxZkwSKapuuyGHb8kyrtuzxat",
    "width": 210,
    "height": 210,
    "format": "svg"
  },
  "infoURL": "https://centrifuge.io",
  "name": "Altair",
  "nativeCurrency": {
    "name": "Altair",
    "symbol": "AIR",
    "decimals": 18
  },
  "networkId": 2088,
  "rpc": [
    "wss://fullnode.altair.centrifuge.io",
    "wss://altair.api.onfinality.io/public-ws"
  ],
  "shortName": "air",
  "slug": "altair",
  "testnet": false
} as const satisfies Chain;