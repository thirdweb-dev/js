import type { Chain } from "../types";
export default {
  "chain": "CELO",
  "chainId": 44787,
  "explorers": [
    {
      "name": "Celoscan",
      "url": "https://alfajores.celoscan.io/",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://celo.org/developers/faucet",
    "https://cauldron.pretoriaresearchlab.io/alfajores-faucet"
  ],
  "features": [],
  "infoURL": "https://docs.celo.org/",
  "name": "Celo Alfajores Testnet",
  "nativeCurrency": {
    "name": "CELO",
    "symbol": "CELO",
    "decimals": 18
  },
  "networkId": 44787,
  "redFlags": [],
  "rpc": [
    "https://celo-alfajores-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://44787.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://alfajores-forno.celo-testnet.org",
    "wss://alfajores-forno.celo-testnet.org/ws"
  ],
  "shortName": "ALFA",
  "slug": "celo-alfajores-testnet",
  "testnet": false
} as const satisfies Chain;