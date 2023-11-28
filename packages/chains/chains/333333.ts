import type { Chain } from "../src/types";
export default {
  "chain": "N3-Test",
  "chainId": 333333,
  "explorers": [
    {
      "name": "Nativ3 Test Explorer",
      "url": "https://scantest.nativ3.network",
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
  "name": "Nativ3 Testnet",
  "nativeCurrency": {
    "name": "USNT",
    "symbol": "USNT",
    "decimals": 18
  },
  "networkId": 333333,
  "parent": {
    "type": "L2",
    "chain": "eip155-421613",
    "bridges": [
      {
        "url": "https://bridgetest.nativ3.network"
      }
    ]
  },
  "rpc": [
    "https://nativ3-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://333333.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctest.nativ3.network",
    "wss://wstest.nativ3.network"
  ],
  "shortName": "N3-Test",
  "slug": "nativ3-testnet",
  "testnet": true
} as const satisfies Chain;