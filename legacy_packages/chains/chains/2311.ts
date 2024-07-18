import type { Chain } from "../src/types";
export default {
  "chain": "LPV",
  "chainId": 2311,
  "explorers": [
    {
      "name": "Lit Vesuvius Explorer",
      "url": "https://vesuvius-explorer.litprotocol.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmXZcwET1LhUxfc2mCdiCJFm61jUHsVVXuZYwx8zhvHQxn",
        "width": 164,
        "height": 164,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://developer.litprotocol.com/support/intro"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmXZcwET1LhUxfc2mCdiCJFm61jUHsVVXuZYwx8zhvHQxn",
    "width": 164,
    "height": 164,
    "format": "png"
  },
  "infoURL": "https://litprotocol.com",
  "name": "Vesuvius - Lit Protocol Testnet",
  "nativeCurrency": {
    "name": "Test LPX",
    "symbol": "tstLPX",
    "decimals": 18
  },
  "networkId": 2311,
  "redFlags": [],
  "rpc": [
    "https://2311.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://vesuvius-rpc.litprotocol.com"
  ],
  "shortName": "lpv",
  "slug": "vesuvius-lit-protocol-testnet",
  "testnet": true
} as const satisfies Chain;