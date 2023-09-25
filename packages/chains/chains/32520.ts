import type { Chain } from "../src/types";
export default {
  "chainId": 32520,
  "chain": "Brise",
  "name": "Bitgert Mainnet",
  "rpc": [
    "https://bitgert.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.icecreamswap.com",
    "https://mainnet-rpc.brisescan.com",
    "https://chainrpc.com",
    "https://serverrpc.com"
  ],
  "slug": "bitgert",
  "icon": {
    "url": "ipfs://QmY3vKe1rG9AyHSGH1ouP3ER3EVUZRtRrFbFZEfEpMSd4V",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitrise Token",
    "symbol": "Brise",
    "decimals": 18
  },
  "infoURL": "https://bitgert.com/",
  "shortName": "Brise",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Brise Scan",
      "url": "https://brisescan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;