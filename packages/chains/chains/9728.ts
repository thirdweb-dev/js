import type { Chain } from "../src/types";
export default {
  "chain": "Boba BNB Testnet",
  "chainId": 9728,
  "explorers": [
    {
      "name": "Boba BNB Testnet block explorer",
      "url": "https://blockexplorer.testnet.bnb.boba.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://boba.network",
  "name": "Boba BNB Testnet",
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "networkId": 9728,
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://gateway.boba.network"
      }
    ]
  },
  "rpc": [
    "https://boba-bnb-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9728.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bnb.boba.network",
    "wss://wss.testnet.bnb.boba.network",
    "https://replica.testnet.bnb.boba.network",
    "wss://replica-wss.testnet.bnb.boba.network",
    "https://boba-bnb-testnet.gateway.tenderly.co",
    "wss://boba-bnb-testnet.gateway.tenderly.co"
  ],
  "shortName": "BobaBnbTestnet",
  "slug": "boba-bnb-testnet",
  "testnet": true
} as const satisfies Chain;