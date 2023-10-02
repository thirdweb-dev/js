import type { Chain } from "../src/types";
export default {
  "name": "Fantom Testnet",
  "chain": "FTM",
  "rpc": [
    "https://fantom-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://fantom-testnet.publicnode.com",
    "https://fantom-testnet.publicnode.com",
    "https://rpc.testnet.fantom.network"
  ],
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
  "chainId": 4002,
  "networkId": 4002,
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/fantom/512.png",
    "height": 512,
    "width": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "ftmscan",
      "url": "https://testnet.ftmscan.com",
      "icon": {
        "url": "ipfs://QmRqbK449Fo9sJ3xMpkPbg6uV1weQj4yVV1xNMP9cdPmjf",
        "width": 73,
        "height": 73,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "fantom-testnet"
} as const satisfies Chain;