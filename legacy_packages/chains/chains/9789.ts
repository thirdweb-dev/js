import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 9789,
  "explorers": [
    {
      "name": "Tabi Testnet Explorer",
      "url": "https://testnet.tabiscan.com",
      "standard": "none"
    },
    {
      "name": "Tabi Testnet Explorer",
      "url": "https://testnet.tabiscan.com/",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.testnet.tabichain.com"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.tabichain.com",
  "name": "Tabichain",
  "nativeCurrency": {
    "name": "TABI",
    "symbol": "TABI",
    "decimals": 18
  },
  "networkId": 9789,
  "redFlags": [],
  "rpc": [
    "https://9789.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.tabichain.com"
  ],
  "shortName": "tabichain",
  "slug": "tabichain",
  "testnet": true
} as const satisfies Chain;