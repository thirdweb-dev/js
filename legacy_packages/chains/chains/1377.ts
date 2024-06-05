import type { Chain } from "../src/types";
export default {
  "chain": "Pingaksha",
  "chainId": 1377,
  "explorers": [
    {
      "name": "Pingaksha",
      "url": "https://pingaksha.ramascan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmUtnYVBeDMKudGq2Wue25pqYfQEdgbyvzTzoGPMqRGMJZ",
        "width": 300,
        "height": 300,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmUtnYVBeDMKudGq2Wue25pqYfQEdgbyvzTzoGPMqRGMJZ",
    "width": 300,
    "height": 300,
    "format": "png"
  },
  "infoURL": "https://www.ramestta.com",
  "name": "Pingaksha testnet",
  "nativeCurrency": {
    "name": "Rama",
    "symbol": "tRAMA",
    "decimals": 18
  },
  "networkId": 1377,
  "rpc": [
    "https://1377.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.ramestta.com"
  ],
  "shortName": "tRAMA",
  "slug": "pingaksha-testnet",
  "testnet": true
} as const satisfies Chain;