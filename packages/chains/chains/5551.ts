import type { Chain } from "../src/types";
export default {
  "chainId": 5551,
  "chain": "Nahmii",
  "name": "Nahmii Mainnet",
  "rpc": [
    "https://nahmii.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://l2.nahmii.io"
  ],
  "slug": "nahmii",
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
  "shortName": "Nahmii",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Nahmii mainnet explorer",
      "url": "https://explorer.nahmii.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;