import type { Chain } from "../src/types";
export default {
  "chain": "Ancient8",
  "chainId": 2863311531,
  "explorers": [
    {
      "name": "a8scan-testnet",
      "url": "https://testnet.a8scan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmXLmYMqZ2ZKyaaEjayNjLai4RUo2YmorUDwkk95xmdTUr",
    "width": 80,
    "height": 80,
    "format": "png"
  },
  "infoURL": "https://ancient8.gg/",
  "name": "Ancient8 Testnet (deprecated)",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2863311531,
  "rpc": [
    "https://ancient8-testnet-deprecated.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2863311531.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.ancient8.gg"
  ],
  "shortName": "a8old",
  "slip44": 1,
  "slug": "ancient8-testnet-deprecated",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;