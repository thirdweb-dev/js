import type { Chain } from "../src/types";
export default {
  "chain": "MAXI",
  "chainId": 899,
  "explorers": [
    {
      "name": "Maxi Chain Mainnet Explorer",
      "url": "https://mainnet.maxi.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmXMLcCaNPMyWCEYX2MZDJHNvj5cpj2cR5dRQtedBRNypT",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://maxi.network",
  "name": "MAXI Chain Mainnet",
  "nativeCurrency": {
    "name": "MAXI GAS",
    "symbol": "MGAS",
    "decimals": 18
  },
  "networkId": 899,
  "rpc": [
    "https://899.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.maxi.network"
  ],
  "shortName": "maxi-mainnet",
  "slug": "maxi-chain",
  "testnet": false
} as const satisfies Chain;