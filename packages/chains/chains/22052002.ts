import type { Chain } from "../src/types";
export default {
  "chainId": 22052002,
  "chain": "XLON",
  "name": "Excelon Mainnet",
  "rpc": [
    "https://excelon.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://edgewallet1.xlon.org/"
  ],
  "slug": "excelon",
  "icon": {
    "url": "ipfs://QmTV45o4jTe6ayscF1XWh1WXk5DPck4QohR5kQocSWjvQP",
    "width": 300,
    "height": 300,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Excelon",
    "symbol": "xlon",
    "decimals": 18
  },
  "infoURL": "https://xlon.org",
  "shortName": "xlon",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Excelon explorer",
      "url": "https://explorer.excelon.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;