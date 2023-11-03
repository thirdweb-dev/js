import type { Chain } from "../types";
export default {
  "chain": "Taf ECO Chain",
  "chainId": 224168,
  "explorers": [
    {
      "name": "Taf ECO Chain Mainnet",
      "url": "https://ecoscan.tafchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreigpxhu7glccsislhjqpl5fnsfmj2io4cy33blhky642uiuyojossy",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://www.tafchain.com",
  "name": "Taf ECO Chain Mainnet",
  "nativeCurrency": {
    "name": "Taf ECO Chain Mainnet",
    "symbol": "TAFECO",
    "decimals": 18
  },
  "networkId": 224168,
  "rpc": [
    "https://taf-eco-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://224168.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.tafchain.com/v1"
  ],
  "shortName": "TAFECO",
  "slug": "taf-eco-chain",
  "testnet": false
} as const satisfies Chain;