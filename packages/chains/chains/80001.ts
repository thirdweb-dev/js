import type { Chain } from "../src/types";
export default {
  "chain": "Polygon",
  "chainId": 80001,
  "explorers": [
    {
      "name": "polygonscan",
      "url": "https://mumbai.polygonscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.polygon.technology/"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/polygon/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://polygon.technology/",
  "name": "Mumbai",
  "nativeCurrency": {
    "name": "MATIC",
    "symbol": "MATIC",
    "decimals": 18
  },
  "networkId": 80001,
  "redFlags": [],
  "rpc": [
    "https://mumbai.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://80001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mumbai.maticvigil.com",
    "https://polygon-mumbai-bor.publicnode.com",
    "wss://polygon-mumbai-bor.publicnode.com",
    "https://polygon-mumbai.gateway.tenderly.co",
    "wss://polygon-mumbai.gateway.tenderly.co"
  ],
  "shortName": "maticmum",
  "slip44": 1,
  "slug": "mumbai",
  "testnet": true,
  "title": "Polygon Testnet Mumbai"
} as const satisfies Chain;