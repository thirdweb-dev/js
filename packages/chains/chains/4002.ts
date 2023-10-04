import type { Chain } from "../src/types";
export default {
  "chain": "FTM",
  "chainId": 4002,
  "explorers": [
    {
      "name": "ftmscan",
      "url": "https://testnet.ftmscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.fantom.network"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/fantom/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://docs.fantom.foundation/quick-start/short-guide#fantom-testnet",
  "name": "Fantom Testnet",
  "nativeCurrency": {
    "name": "Fantom",
    "symbol": "FTM",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://fantom-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://fantom-testnet.publicnode.com",
    "https://fantom-testnet.publicnode.com",
    "https://rpc.testnet.fantom.network"
  ],
  "shortName": "tftm",
  "slug": "fantom-testnet",
  "testnet": true
} as const satisfies Chain;