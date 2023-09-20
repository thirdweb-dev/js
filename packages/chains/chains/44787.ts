import type { Chain } from "../src/types";
export default {
  "name": "Celo Alfajores Testnet",
  "chainId": 44787,
  "shortName": "ALFA",
  "chain": "CELO",
  "networkId": 44787,
  "nativeCurrency": {
    "name": "CELO",
    "symbol": "CELO",
    "decimals": 18
  },
  "rpc": [
    "https://celo-alfajores-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://alfajores-forno.celo-testnet.org/ws",
    "https://alfajores-forno.celo-testnet.org"
  ],
  "faucets": [
    "https://cauldron.pretoriaresearchlab.io/alfajores-faucet",
    "https://celo.org/developers/faucet"
  ],
  "infoURL": "https://docs.celo.org/",
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
  "testnet": true,
  "slug": "celo-alfajores-testnet"
} as const satisfies Chain;