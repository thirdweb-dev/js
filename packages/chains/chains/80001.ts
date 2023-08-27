import type { Chain } from "../src/types";
export default {
  "name": "Mumbai",
  "title": "Polygon Testnet Mumbai",
  "chain": "Polygon",
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/polygon/512.png",
    "height": 512,
    "width": 512,
    "format": "png"
  },
  "rpc": [
    "https://mumbai.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}",
    "https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://matic-mumbai.chainstacklabs.com",
    "https://rpc-mumbai.maticvigil.com",
    "https://matic-testnet-archive-rpc.bwarelabs.com",
    "https://polygon-mumbai-bor.publicnode.com",
    "https://polygon-mumbai.gateway.tenderly.co",
    "wss://polygon-mumbai.gateway.tenderly.co"
  ],
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
  "chainId": 80001,
  "networkId": 80001,
  "explorers": [
    {
      "name": "polygonscan",
      "url": "https://mumbai.polygonscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "mumbai"
} as const satisfies Chain;