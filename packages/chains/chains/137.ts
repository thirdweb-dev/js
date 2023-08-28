import type { Chain } from "../src/types";
export default {
  "name": "Polygon Mainnet",
  "chain": "Polygon",
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/polygon/512.png",
    "height": 512,
    "width": 512,
    "format": "png"
  },
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
    "https://polygon.gateway.tenderly.co",
    "wss://polygon.gateway.tenderly.co"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MATIC",
    "symbol": "MATIC",
    "decimals": 18
  },
  "infoURL": "https://polygon.technology/",
  "shortName": "matic",
  "chainId": 137,
  "networkId": 137,
  "slip44": 966,
  "explorers": [
    {
      "name": "polygonscan",
      "url": "https://polygonscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "polygon"
} as const satisfies Chain;