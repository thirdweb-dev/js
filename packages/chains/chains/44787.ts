import type { Chain } from "../src/types";
export default {
  "chain": "CELO",
  "chainId": 44787,
  "explorers": [
    {
      "name": "Celoscan",
      "url": "https://alfajores.celoscan.io/",
      "standard": "EIP3091"
    },
    {
      "name": "Alfajoresscan",
      "url": "https://alfajores.celoscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://cauldron.pretoriaresearchlab.io/alfajores-faucet",
    "https://celo.org/developers/faucet"
  ],
  "features": [],
  "infoURL": "https://docs.celo.org/",
  "name": "Celo Alfajores Testnet",
  "nativeCurrency": {
    "name": "CELO",
    "symbol": "CELO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://celo-alfajores-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://alfajores-forno.celo-testnet.org/ws",
    "https://alfajores-forno.celo-testnet.org"
  ],
  "shortName": "ALFA",
  "slug": "celo-alfajores-testnet",
  "testnet": true
} as const satisfies Chain;