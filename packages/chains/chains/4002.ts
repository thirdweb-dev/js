import type { Chain } from "../src/types";
export default {
  "chainId": 4002,
  "chain": "FTM",
  "name": "Fantom Testnet",
  "rpc": [
    "https://fantom-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://fantom-testnet.publicnode.com",
    "https://fantom-testnet.publicnode.com",
    "https://rpc.testnet.fantom.network"
  ],
  "slug": "fantom-testnet",
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/fantom/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://faucet.fantom.network"
  ],
  "nativeCurrency": {
    "name": "Fantom",
    "symbol": "FTM",
    "decimals": 18
  },
  "infoURL": "https://docs.fantom.foundation/quick-start/short-guide#fantom-testnet",
  "shortName": "tftm",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "ftmscan",
      "url": "https://testnet.ftmscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;