import type { Chain } from "../src/types";
export default {
  "name": "Taf ECO Chain Mainnet",
  "chain": "Taf ECO Chain",
  "icon": {
    "url": "ipfs://bafkreigpxhu7glccsislhjqpl5fnsfmj2io4cy33blhky642uiuyojossy",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "rpc": [
    "https://taf-eco-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.tafchain.com/v1"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Taf ECO Chain Mainnet",
    "symbol": "TAFECO",
    "decimals": 18
  },
  "infoURL": "https://www.tafchain.com",
  "shortName": "TAFECO",
  "chainId": 224168,
  "networkId": 224168,
  "explorers": [
    {
      "name": "Taf ECO Chain Mainnet",
      "url": "https://ecoscan.tafchain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "taf-eco-chain"
} as const satisfies Chain;