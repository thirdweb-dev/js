import type { Chain } from "../src/types";
export default {
  "chain": "Polygon",
  "chainId": 80002,
  "explorers": [
    {
      "name": "polygonamoy",
      "url": "https://www.oklink.com/amoy",
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
  "name": "Polygon Amoy Testnet",
  "nativeCurrency": {
    "name": "MATIC",
    "symbol": "MATIC",
    "decimals": 18
  },
  "networkId": 80002,
  "redFlags": [],
  "rpc": [
    "https://80002.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-amoy.polygon.technology",
    "https://polygon-amoy-bor-rpc.publicnode.com",
    "wss://polygon-amoy-bor-rpc.publicnode.com"
  ],
  "shortName": "polygonamoy",
  "slip44": 1,
  "slug": "polygon-amoy-testnet",
  "testnet": true,
  "title": "Polygon Amoy Testnet"
} as const satisfies Chain;