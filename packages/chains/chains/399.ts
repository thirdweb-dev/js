import type { Chain } from "../src/types";
export default {
  "chain": "Nativ3",
  "chainId": 399,
  "explorers": [
    {
      "name": "N3scan",
      "url": "https://scan.nativ3.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmVzJDndPui6qBSeJWe5kMLA56C3KpVhqqqk9xvVKE1DGb",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://nativ3.network",
  "name": "Nativ3 Mainnet",
  "nativeCurrency": {
    "name": "USNT",
    "symbol": "USNT",
    "decimals": 18
  },
  "networkId": 399,
  "parent": {
    "type": "L2",
    "chain": "eip155-42161",
    "bridges": [
      {
        "url": "https://bridge.nativ3.network"
      }
    ]
  },
  "rpc": [
    "https://399.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.nativ3.network",
    "wss://ws.nativ3.network"
  ],
  "shortName": "N3",
  "slug": "nativ3",
  "testnet": false
} as const satisfies Chain;