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
  "infoURL": "https://docs.celo.org/",
  "name": "Celo Mainnet",
  "nativeCurrency": {
    "name": "CELO",
    "symbol": "CELO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://celo.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://forno.celo.org",
    "wss://forno.celo.org/ws"
  ],
  "shortName": "celo",
  "slug": "celo",
  "testnet": false
} as const satisfies Chain;