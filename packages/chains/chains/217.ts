import type { Chain } from "../src/types";
export default {
  "chainId": 217,
  "chain": "SIN2",
  "name": "SiriusNet V2",
  "rpc": [
    "https://siriusnet-v2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc2.siriusnet.io"
  ],
  "slug": "siriusnet-v2",
  "icon": {
    "url": "ipfs://bafybeicxuxdzrzpwsil4owqmn7wpwka2rqsohpfqmukg57pifzyxr5om2q",
    "width": 100,
    "height": 100,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "MCD",
    "symbol": "MCD",
    "decimals": 18
  },
  "infoURL": "https://siriusnet.io",
  "shortName": "SIN2",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "siriusnet explorer",
      "url": "https://scan.siriusnet.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;