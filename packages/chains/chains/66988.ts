import type { Chain } from "../src/types";
export default {
  "chain": "JanusNetwork",
  "chainId": 66988,
  "explorers": [
    {
      "name": "JanusNetwork Testnet Explorer",
      "url": "https://beta.scan.janusnetwork.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreifc3vnwf4hj3bo6fg4u5qlqmjgajjgezyeg236qjcihl4ha42siuq",
    "width": 819,
    "height": 792,
    "format": "png"
  },
  "infoURL": "https://janus-network.gitbook.io/janus",
  "name": "Janus Testnet",
  "nativeCurrency": {
    "name": "Janus",
    "symbol": "JNS",
    "decimals": 18
  },
  "networkId": 66988,
  "rpc": [
    "https://janus-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://66988.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.test.janusnetwork.io"
  ],
  "shortName": "janusnetwork-testnet",
  "slip44": 1,
  "slug": "janus-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;