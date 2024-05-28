import type { Chain } from "../src/types";
export default {
  "chain": "LUKSO Testnet",
  "chainId": 4201,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.execution.testnet.lukso.network",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.testnet.lukso.network"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://lukso.network",
  "name": "LUKSO Testnet",
  "nativeCurrency": {
    "name": "TestLYX",
    "symbol": "LYXt",
    "decimals": 18
  },
  "networkId": 4201,
  "rpc": [
    "https://4201.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.lukso.network",
    "wss://ws-rpc.testnet.lukso.network"
  ],
  "shortName": "lukso-testnet",
  "slip44": 1,
  "slug": "lukso-testnet",
  "testnet": true
} as const satisfies Chain;