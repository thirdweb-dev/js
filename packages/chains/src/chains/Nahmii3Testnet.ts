import type { Chain } from "../types";
export default {
  "chain": "Nahmii",
  "chainId": 4062,
  "explorers": [
    {
      "name": "Nahmii 3 Testnet Explorer",
      "url": "https://explorer.testnet.n3.nahmii.io",
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
  "name": "Nahmii 3 Testnet",
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 4062,
  "parent": {
    "type": "L2",
    "chain": "eip155-3",
    "bridges": [
      {
        "url": "https://bridge.testnet.n3.nahmii.io"
      }
    ]
  },
  "rpc": [
    "https://nahmii-3-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4062.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ngeth.testnet.n3.nahmii.io"
  ],
  "shortName": "Nahmii3Testnet",
  "slug": "nahmii-3-testnet",
  "testnet": true
} as const satisfies Chain;