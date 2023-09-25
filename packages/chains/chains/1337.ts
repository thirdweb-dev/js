import type { Chain } from "../src/types";
export default {
  "chainId": 1337,
  "chain": "ETH",
  "name": "Localhost",
  "rpc": [
    "https://localhost.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://localhost:8545"
  ],
  "slug": "localhost",
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "shortName": "local",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;