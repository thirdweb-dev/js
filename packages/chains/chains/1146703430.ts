import type { Chain } from "../src/types";
export default {
  "name": "CyberdeckNet",
  "chain": "cyberdeck",
  "rpc": [
    "https://cyberdecknet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://cybeth1.cyberdeck.eu:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Cyb",
    "symbol": "CYB",
    "decimals": 18
  },
  "infoURL": "https://cyberdeck.eu",
  "shortName": "cyb",
  "chainId": 1146703430,
  "networkId": 1146703430,
  "icon": {
    "url": "ipfs://QmTvYMJXeZeWxYPuoQ15mHCS8K5EQzkMMCHQVs3GshooyR",
    "width": 193,
    "height": 214,
    "format": "png"
  },
  "status": "active",
  "explorers": [
    {
      "name": "CybEthExplorer",
      "url": "http://cybeth1.cyberdeck.eu:8000",
      "icon": {
        "url": "ipfs://QmTvYMJXeZeWxYPuoQ15mHCS8K5EQzkMMCHQVs3GshooyR",
        "width": 193,
        "height": 214,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "cyberdecknet"
} as const satisfies Chain;