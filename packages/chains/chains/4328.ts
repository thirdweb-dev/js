import type { Chain } from "../src/types";
export default {
  "chain": "Bobafuji Testnet",
  "chainId": 4328,
  "explorers": [
    {
      "name": "Bobafuji Testnet block explorer",
      "url": "https://blockexplorer.testnet.avax.boba.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://boba.network",
  "name": "Bobafuji Testnet",
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "networkId": 4328,
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
    "https://4328.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.avax.boba.network",
    "wss://wss.testnet.avax.boba.network",
    "https://replica.testnet.avax.boba.network"
  ],
  "shortName": "BobaFujiTestnet",
  "slip44": 1,
  "slug": "bobafuji-testnet",
  "testnet": true
} as const satisfies Chain;