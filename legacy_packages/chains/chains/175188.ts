import type { Chain } from "../src/types";
export default {
  "chain": "LPY",
  "chainId": 175188,
  "explorers": [
    {
      "name": "Lit Chronicle Yellowstone Explorer",
      "url": "https://yellowstone-explorer.litprotocol.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmXZcwET1LhUxfc2mCdiCJFm61jUHsVVXuZYwx8zhvHQxn",
        "width": 164,
        "height": 120,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://developer.litprotocol.com/support/intro"
  ],
  "icon": {
    "url": "ipfs://QmXZcwET1LhUxfc2mCdiCJFm61jUHsVVXuZYwx8zhvHQxn",
    "width": 164,
    "height": 120,
    "format": "png"
  },
  "infoURL": "https://litprotocol.com",
  "name": "Chronicle Yellowstone - Lit Protocol Testnet",
  "nativeCurrency": {
    "name": "Test LPX",
    "symbol": "tstLPX",
    "decimals": 18
  },
  "networkId": 175188,
  "rpc": [
    "https://175188.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://yellowstone-rpc.litprotocol.com"
  ],
  "shortName": "lpy",
  "slug": "chronicle-yellowstone-lit-protocol-testnet",
  "testnet": true
} as const satisfies Chain;