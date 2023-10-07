import type { Chain } from "../src/types";
export default {
  "chain": "Nahmii",
  "chainId": 4062,
  "explorers": [
    {
      "name": "Nahmii 3 Testnet Explorer",
      "url": "https://explorer.testnet.n3.nahmii.io",
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
  "name": "Nahmii 3 Testnet",
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://nahmii-3-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ngeth.testnet.n3.nahmii.io"
  ],
  "shortName": "Nahmii3Testnet",
  "slug": "nahmii-3-testnet",
  "testnet": true
} as const satisfies Chain;