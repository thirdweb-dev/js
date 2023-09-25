import type { Chain } from "../src/types";
export default {
  "chainId": 1146703430,
  "chain": "cyberdeck",
  "name": "CyberdeckNet",
  "rpc": [
    "https://cyberdecknet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://cybeth1.cyberdeck.eu:8545"
  ],
  "slug": "cyberdecknet",
  "icon": {
    "url": "ipfs://QmTvYMJXeZeWxYPuoQ15mHCS8K5EQzkMMCHQVs3GshooyR",
    "width": 193,
    "height": 214,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Cyb",
    "symbol": "CYB",
    "decimals": 18
  },
  "infoURL": "https://cyberdeck.eu",
  "shortName": "cyb",
  "testnet": false,
  "status": "active",
  "redFlags": [],
  "explorers": [
    {
      "name": "CybEthExplorer",
      "url": "http://cybeth1.cyberdeck.eu:8000",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;