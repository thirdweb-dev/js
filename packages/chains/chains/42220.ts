import type { Chain } from "../src/types";
export default {
  "chainId": 42220,
  "chain": "CELO",
  "name": "Celo Mainnet",
  "rpc": [
    "https://celo.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://forno.celo.org",
    "wss://forno.celo.org/ws"
  ],
  "slug": "celo",
  "faucets": [],
  "nativeCurrency": {
    "name": "CELO",
    "symbol": "CELO",
    "decimals": 18
  },
  "infoURL": "https://docs.celo.org/",
  "shortName": "celo",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;