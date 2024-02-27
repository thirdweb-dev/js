import type { Chain } from "../src/types";
export default {
  "chain": "Nahmii",
  "chainId": 5551,
  "explorers": [
    {
      "name": "Nahmii mainnet explorer",
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
  "name": "Nahmii Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 5551,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.nahmii.io"
      }
    ]
  },
  "rpc": [
    "https://5551.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://l2.nahmii.io"
  ],
  "shortName": "Nahmii",
  "slug": "nahmii",
  "testnet": false
} as const satisfies Chain;