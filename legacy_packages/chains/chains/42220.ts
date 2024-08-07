import type { Chain } from "../src/types";
export default {
  "chain": "CELO",
  "chainId": 42220,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.celo.org",
      "standard": "none"
    },
    {
      "name": "Celoscan",
      "url": "https://celoscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmZcLzM1nMeU2oxhLFBUGJyujQ4gKuWAdXBDGHVtDmzZxf",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://docs.celo.org/",
  "name": "Celo Mainnet",
  "nativeCurrency": {
    "name": "CELO",
    "symbol": "CELO",
    "decimals": 18
  },
  "networkId": 42220,
  "redFlags": [],
  "rpc": [
    "https://42220.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://forno.celo.org",
    "wss://forno.celo.org/ws"
  ],
  "shortName": "celo",
  "slug": "celo",
  "testnet": false
} as const satisfies Chain;