import type { Chain } from "../src/types";
export default {
  "chain": "SIN2",
  "chainId": 217,
  "explorers": [
    {
      "name": "siriusnet explorer",
      "url": "https://scan.siriusnet.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafybeicxuxdzrzpwsil4owqmn7wpwka2rqsohpfqmukg57pifzyxr5om2q",
    "width": 100,
    "height": 100,
    "format": "png"
  },
  "infoURL": "https://siriusnet.io",
  "name": "SiriusNet V2",
  "nativeCurrency": {
    "name": "MCD",
    "symbol": "MCD",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://siriusnet-v2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc2.siriusnet.io"
  ],
  "shortName": "SIN2",
  "slug": "siriusnet-v2",
  "testnet": false
} as const satisfies Chain;