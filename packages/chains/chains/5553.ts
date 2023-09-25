import type { Chain } from "../src/types";
export default {
  "chainId": 5553,
  "chain": "Nahmii",
  "name": "Nahmii Testnet",
  "rpc": [
    "https://nahmii-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://l2.testnet.nahmii.io"
  ],
  "slug": "nahmii-testnet",
  "icon": {
    "url": "ipfs://QmZhKXgoGpzvthr2eh8ZNgT75YvMtEBegdELAaMPPzf5QT",
    "width": 384,
    "height": 384,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://nahmii.io",
  "shortName": "NahmiiTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.testnet.nahmii.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;