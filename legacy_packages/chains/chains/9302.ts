import type { Chain } from "../src/types";
export default {
  "chain": "GNET",
  "chainId": 9302,
  "explorers": [
    {
      "name": "Galactica Reticulum explorer",
      "url": "https://explorer-reticulum.galactica.com/",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmXJMnrSqYFJz7Y8CjVLKbAVQAxgHKWXVn3TXnJwjitDms",
        "width": 684,
        "height": 684,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmaTFSuXQXXZYsSGkqjCGPy6on41gPueaeCAMz9J32LHTS",
    "width": 942,
    "height": 942,
    "format": "png"
  },
  "name": "Galactica-Reticulum",
  "nativeCurrency": {
    "name": "GNET",
    "symbol": "GNET",
    "decimals": 18
  },
  "networkId": 9302,
  "redFlags": [],
  "rpc": [
    "https://9302.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc-http-reticulum.galactica.com/"
  ],
  "shortName": "GNET",
  "slug": "galactica-reticulum",
  "testnet": true
} as const satisfies Chain;