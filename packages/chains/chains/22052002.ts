import type { Chain } from "../src/types";
export default {
  "chain": "XLON",
  "chainId": 22052002,
  "explorers": [
    {
      "name": "Excelon explorer",
      "url": "https://explorer.excelon.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTV45o4jTe6ayscF1XWh1WXk5DPck4QohR5kQocSWjvQP",
    "width": 300,
    "height": 300,
    "format": "png"
  },
  "infoURL": "https://xlon.org",
  "name": "Excelon Mainnet",
  "nativeCurrency": {
    "name": "Excelon",
    "symbol": "xlon",
    "decimals": 18
  },
  "networkId": 22052002,
  "rpc": [
    "https://22052002.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://edgewallet1.xlon.org/"
  ],
  "shortName": "xlon",
  "slug": "excelon",
  "testnet": false
} as const satisfies Chain;