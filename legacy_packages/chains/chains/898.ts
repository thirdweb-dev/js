import type { Chain } from "../src/types";
export default {
  "chain": "MAXI",
  "chainId": 898,
  "explorers": [
    {
      "name": "Maxi Chain Testnet Explorer",
      "url": "https://testnet.maxi.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.maxi.network"
  ],
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
  "name": "MAXI Chain Testnet",
  "nativeCurrency": {
    "name": "MAXI GAS",
    "symbol": "MGAS",
    "decimals": 18
  },
  "networkId": 898,
  "rpc": [
    "https://898.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.maxi.network"
  ],
  "shortName": "maxi-testnet",
  "slug": "maxi-chain-testnet",
  "testnet": true
} as const satisfies Chain;