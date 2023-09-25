import type { Chain } from "../src/types";
export default {
  "chainId": 39815,
  "chain": "OHO",
  "name": "OHO Mainnet",
  "rpc": [
    "https://oho.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.oho.ai"
  ],
  "slug": "oho",
  "icon": {
    "url": "ipfs://QmZt75xixnEtFzqHTrJa8kJkV4cTXmUZqeMeHM8BcvomQc",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "OHO",
    "symbol": "OHO",
    "decimals": 18
  },
  "infoURL": "https://oho.ai",
  "shortName": "oho",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "ohoscan",
      "url": "https://ohoscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;