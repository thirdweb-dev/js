import type { Chain } from "../types";
export default {
  "chain": "Nahmii",
  "chainId": 4061,
  "explorers": [],
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
        "url": "https://bridge.nahmii.io"
      }
    ]
  },
  "rpc": [],
  "shortName": "Nahmii3Mainnet",
  "slug": "nahmii-3",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;