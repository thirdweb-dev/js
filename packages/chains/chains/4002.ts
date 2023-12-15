import type { Chain } from "../src/types";
export default {
  "chain": "FTM",
  "chainId": 4002,
  "explorers": [
    {
      "name": "ftmscan",
      "url": "https://testnet.ftmscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRqbK449Fo9sJ3xMpkPbg6uV1weQj4yVV1xNMP9cdPmjf",
        "width": 73,
        "height": 73,
        "format": "png"
      }
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
  "networkId": 4002,
  "redFlags": [],
  "rpc": [
    "https://fantom-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4002.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.fantom.network",
    "https://fantom-testnet.publicnode.com",
    "wss://fantom-testnet.publicnode.com"
  ],
  "shortName": "tftm",
  "slug": "fantom-testnet",
  "testnet": true
} as const satisfies Chain;