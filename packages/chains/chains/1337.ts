import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1337,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "name": "Localhost",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1337,
  "redFlags": [],
  "rpc": [
    "http://localhost:8545"
  ],
  "shortName": "local",
  "slug": "localhost",
  "testnet": true
} as const satisfies Chain;