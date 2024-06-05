import type { Chain } from "../src/types";
export default {
  "chain": "Ramestta",
  "chainId": 1370,
  "explorers": [
    {
      "name": "ramascan",
      "url": "https://ramascan.com",
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
  "name": "Ramestta Mainnet",
  "nativeCurrency": {
    "name": "Rama",
    "symbol": "RAMA",
    "decimals": 18
  },
  "networkId": 1370,
  "rpc": [
    "https://1370.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://blockchain.ramestta.com",
    "https://blockchain2.ramestta.com"
  ],
  "shortName": "RAMA",
  "slug": "ramestta",
  "testnet": false
} as const satisfies Chain;