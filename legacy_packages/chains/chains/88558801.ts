import type { Chain } from "../src/types";
export default {
  "chain": "backstopTestnet",
  "chainId": 88558801,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmaWH5iWif22gtYVizWvuPoEHZ3qZjYc8nXnEgPh9rLMiY",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "infoURL": "https://backstop.technology/testnet",
  "name": "Backstop Testnet",
  "nativeCurrency": {
    "name": "Backstop Testnet 1",
    "symbol": "ZBS",
    "decimals": 18
  },
  "networkId": 88558801,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://testnet.bridge.backstop.technology"
      }
    ]
  },
  "rpc": [
    "https://88558801.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.backstop.technology"
  ],
  "shortName": "backstop-testnet",
  "slug": "backstop-testnet",
  "testnet": true
} as const satisfies Chain;