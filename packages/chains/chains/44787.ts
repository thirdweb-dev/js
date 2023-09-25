import type { Chain } from "../src/types";
export default {
  "chainId": 44787,
  "chain": "CELO",
  "name": "Celo Alfajores Testnet",
  "rpc": [
    "https://celo-alfajores-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://alfajores-forno.celo-testnet.org/ws",
    "https://alfajores-forno.celo-testnet.org"
  ],
  "slug": "celo-alfajores-testnet",
  "faucets": [
    "https://cauldron.pretoriaresearchlab.io/alfajores-faucet",
    "https://celo.org/developers/faucet"
  ],
  "nativeCurrency": {
    "name": "CELO",
    "symbol": "CELO",
    "decimals": 18
  },
  "infoURL": "https://docs.celo.org/",
  "shortName": "ALFA",
  "testnet": true,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;