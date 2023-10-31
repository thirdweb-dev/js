import type { Chain } from "../src/types";
export default {
  "chain": "OHO",
  "chainId": 39815,
  "explorers": [
    {
      "name": "ohoscan",
      "url": "https://ohoscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmZt75xixnEtFzqHTrJa8kJkV4cTXmUZqeMeHM8BcvomQc",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZt75xixnEtFzqHTrJa8kJkV4cTXmUZqeMeHM8BcvomQc",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://oho.ai",
  "name": "OHO Mainnet",
  "nativeCurrency": {
    "name": "OHO",
    "symbol": "OHO",
    "decimals": 18
  },
  "networkId": 39815,
  "rpc": [
    "https://oho.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://39815.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.oho.ai"
  ],
  "shortName": "oho",
  "slug": "oho",
  "testnet": false
} as const satisfies Chain;