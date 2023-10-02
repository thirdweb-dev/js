import type { Chain } from "../src/types";
export default {
  "chain": "Brise",
  "chainId": 32520,
  "explorers": [
    {
      "name": "Brise Scan",
      "url": "https://brisescan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmY3vKe1rG9AyHSGH1ouP3ER3EVUZRtRrFbFZEfEpMSd4V",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://bitgert.com/",
  "name": "Bitgert Mainnet",
  "nativeCurrency": {
    "name": "Bitrise Token",
    "symbol": "Brise",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://bitgert.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.icecreamswap.com",
    "https://mainnet-rpc.brisescan.com",
    "https://chainrpc.com",
    "https://serverrpc.com"
  ],
  "shortName": "Brise",
  "slug": "bitgert",
  "testnet": false
} as const satisfies Chain;