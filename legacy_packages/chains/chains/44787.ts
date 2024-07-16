import type { Chain } from "../src/types";
export default {
  "chain": "CELO",
  "chainId": 44787,
  "explorers": [
    {
      "name": "Alfajoresscan",
      "url": "https://alfajores.celoscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmZcLzM1nMeU2oxhLFBUGJyujQ4gKuWAdXBDGHVtDmzZxf",
        "width": 400,
        "height": 400,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://celo.org/developers/faucet",
    "https://cauldron.pretoriaresearchlab.io/alfajores-faucet"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmZcLzM1nMeU2oxhLFBUGJyujQ4gKuWAdXBDGHVtDmzZxf",
    "width": 400,
    "height": 400,
    "format": "png"
  },
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
    "https://44787.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://alfajores-forno.celo-testnet.org",
    "wss://alfajores-forno.celo-testnet.org/ws"
  ],
  "shortName": "ALFA",
  "slip44": 1,
  "slug": "celo-alfajores-testnet",
  "testnet": true
} as const satisfies Chain;