import type { Chain } from "../src/types";
export default {
  "chainId": 4062,
  "chain": "Nahmii",
  "name": "Nahmii 3 Testnet",
  "rpc": [
    "https://nahmii-3-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ngeth.testnet.n3.nahmii.io"
  ],
  "slug": "nahmii-3-testnet",
  "icon": {
    "url": "ipfs://QmZhKXgoGpzvthr2eh8ZNgT75YvMtEBegdELAaMPPzf5QT",
    "width": 384,
    "height": 384,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://nahmii.io",
  "shortName": "Nahmii3Testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Nahmii 3 Testnet Explorer",
      "url": "https://explorer.testnet.n3.nahmii.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;