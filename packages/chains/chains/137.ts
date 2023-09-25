import type { Chain } from "../src/types";
export default {
  "chainId": 137,
  "chain": "Polygon",
  "name": "Polygon Mainnet",
  "rpc": [
    "https://polygon.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://polygon-rpc.com/",
    "https://rpc-mainnet.matic.network",
    "https://matic-mainnet.chainstacklabs.com",
    "https://rpc-mainnet.maticvigil.com",
    "https://rpc-mainnet.matic.quiknode.pro",
    "https://matic-mainnet-full-rpc.bwarelabs.com",
    "https://polygon-bor.publicnode.com",
    "wss://polygon-bor.publicnode.com",
    "https://polygon.gateway.tenderly.co",
    "wss://polygon.gateway.tenderly.co"
  ],
  "slug": "polygon",
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/polygon/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "MATIC",
    "symbol": "MATIC",
    "decimals": 18
  },
  "infoURL": "https://polygon.technology/",
  "shortName": "matic",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "polygonscan",
      "url": "https://polygonscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;