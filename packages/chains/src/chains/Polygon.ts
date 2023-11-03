import type { Chain } from "../types";
export default {
  "chain": "Polygon",
  "chainId": 137,
  "explorers": [
    {
      "name": "polygonscan",
      "url": "https://polygonscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "dexguru",
      "url": "https://polygon.dex.guru",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRaASKRSjQ5btoUQ2rNTJNxKtx2a2RoewgA7DMQkLVEne",
        "width": 83,
        "height": 82,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/polygon/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://polygon.technology/",
  "name": "Polygon Mainnet",
  "nativeCurrency": {
    "name": "MATIC",
    "symbol": "MATIC",
    "decimals": 18
  },
  "networkId": 137,
  "redFlags": [],
  "rpc": [
    "https://polygon.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://137.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
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
  "shortName": "matic",
  "slip44": 966,
  "slug": "polygon",
  "testnet": false
} as const satisfies Chain;