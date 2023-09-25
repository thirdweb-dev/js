import type { Chain } from "../src/types";
export default {
  "chainId": 80001,
  "chain": "Polygon",
  "name": "Mumbai",
  "rpc": [
    "https://mumbai.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}",
    "https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://rpc-mumbai.maticvigil.com",
    "https://polygon-mumbai-bor.publicnode.com",
    "wss://polygon-mumbai-bor.publicnode.com",
    "https://polygon-mumbai.gateway.tenderly.co",
    "wss://polygon-mumbai.gateway.tenderly.co"
  ],
  "slug": "mumbai",
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/polygon/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://faucet.polygon.technology/"
  ],
  "nativeCurrency": {
    "name": "MATIC",
    "symbol": "MATIC",
    "decimals": 18
  },
  "infoURL": "https://polygon.technology/",
  "shortName": "maticmum",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "polygonscan",
      "url": "https://mumbai.polygonscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;