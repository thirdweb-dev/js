import type { Chain } from "../src/types";
export default {
  "chainId": 224168,
  "chain": "Taf ECO Chain",
  "name": "Taf ECO Chain Mainnet",
  "rpc": [
    "https://taf-eco-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.tafchain.com/v1"
  ],
  "slug": "taf-eco-chain",
  "icon": {
    "url": "ipfs://bafkreigpxhu7glccsislhjqpl5fnsfmj2io4cy33blhky642uiuyojossy",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Taf ECO Chain Mainnet",
    "symbol": "TAFECO",
    "decimals": 18
  },
  "infoURL": "https://www.tafchain.com",
  "shortName": "TAFECO",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Taf ECO Chain Mainnet",
      "url": "https://ecoscan.tafchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;