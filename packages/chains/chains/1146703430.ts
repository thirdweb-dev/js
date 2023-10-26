import type { Chain } from "../src/types";
export default {
  "chain": "cyberdeck",
  "chainId": 1146703430,
  "explorers": [
    {
      "name": "CybEthExplorer",
      "url": "http://cybeth1.cyberdeck.eu:8000",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmTvYMJXeZeWxYPuoQ15mHCS8K5EQzkMMCHQVs3GshooyR",
        "width": 193,
        "height": 214,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTvYMJXeZeWxYPuoQ15mHCS8K5EQzkMMCHQVs3GshooyR",
    "width": 193,
    "height": 214,
    "format": "png"
  },
  "infoURL": "https://cyberdeck.eu",
  "name": "CyberdeckNet",
  "nativeCurrency": {
    "name": "Cyb",
    "symbol": "CYB",
    "decimals": 18
  },
  "networkId": 1146703430,
  "rpc": [
    "https://cyberdecknet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1146703430.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://cybeth1.cyberdeck.eu:8545"
  ],
  "shortName": "cyb",
  "slug": "cyberdecknet",
  "status": "active",
  "testnet": false
} as const satisfies Chain;