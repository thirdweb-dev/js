import type { Chain } from "../src/types";
export default {
  "chain": "Nahmii",
  "chainId": 4061,
  "explorers": [
    {
      "name": "Nahmii 3 Mainnet Explorer",
      "url": "https://explorer.nahmii.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmZhKXgoGpzvthr2eh8ZNgT75YvMtEBegdELAaMPPzf5QT",
        "width": 384,
        "height": 384,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZhKXgoGpzvthr2eh8ZNgT75YvMtEBegdELAaMPPzf5QT",
    "width": 384,
    "height": 384,
    "format": "png"
  },
  "infoURL": "https://nahmii.io",
  "name": "Nahmii 3 Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 4061,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://accounts.nahmii.io"
      }
    ]
  },
  "rpc": [
    "https://4061.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.n3.nahmii.io"
  ],
  "shortName": "Nahmii3Mainnet",
  "slug": "nahmii-3",
  "status": "active",
  "testnet": false
} as const satisfies Chain;