import type { Chain } from "../src/types";
export default {
  "chain": "Nahmii",
  "chainId": 5553,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.testnet.nahmii.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmZhKXgoGpzvthr2eh8ZNgT75YvMtEBegdELAaMPPzf5QT",
    "width": 384,
    "height": 384,
    "format": "png"
  },
  "infoURL": "https://nahmii.io",
  "name": "Nahmii Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://nahmii-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://l2.testnet.nahmii.io"
  ],
  "shortName": "NahmiiTestnet",
  "slug": "nahmii-testnet",
  "testnet": true
} as const satisfies Chain;