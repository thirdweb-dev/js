import type { Chain } from "../src/types";
export default {
  "chain": "Pentagon",
  "chainId": 555555,
  "explorers": [
    {
      "name": "Pentagon Testnet Explorer",
      "url": "https://explorer-testnet.pentagon.games",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmfU7W3Tm3tGWgnHBTG9vjB4PXGMvcL7Cq8R6MaSaC33DC",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://bridge-testnet.pentagon.games"
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
    "url": "ipfs://QmfU7W3Tm3tGWgnHBTG9vjB4PXGMvcL7Cq8R6MaSaC33DC",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://pentagon.games",
  "name": "Pentagon Testnet",
  "nativeCurrency": {
    "name": "Pentagon",
    "symbol": "PEN",
    "decimals": 18
  },
  "networkId": 555555,
  "rpc": [
    "https://555555.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.pentagon.games"
  ],
  "shortName": "pentagon-testnet",
  "slug": "pentagon-testnet",
  "testnet": true
} as const satisfies Chain;