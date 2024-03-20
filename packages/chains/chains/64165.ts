import type { Chain } from "../src/types";
export default {
  "chain": "FTM",
  "chainId": 64165,
  "ens": {
    "registry": "standard"
  },
  "explorers": [
    {
      "name": "Fantom Sonic Builders Testnet",
      "url": "https://sonicscan.io/",
      "standard": "standard",
      "icon": {
        "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/fantom/512.png",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://public-sonic.fantom.network/account"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/fantom/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://sonicscan.io/",
  "name": "Fantom Sonic Builders Testnet",
  "nativeCurrency": {
    "name": "Fantom",
    "symbol": "FTM",
    "decimals": 18
  },
  "networkId": 64165,
  "redFlags": [],
  "rpc": [
    "https://64165.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.sonic.fantom.network/"
  ],
  "shortName": "FantomTestnet",
  "slug": "fantom-sonic-builders-testnet",
  "testnet": true
} as const satisfies Chain;