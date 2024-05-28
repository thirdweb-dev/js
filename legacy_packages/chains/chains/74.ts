import type { Chain } from "../src/types";
export default {
  "chain": "IDChain",
  "chainId": 74,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.idchain.one",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://idchain.one/begin/",
  "name": "IDChain Mainnet",
  "nativeCurrency": {
    "name": "EIDI",
    "symbol": "EIDI",
    "decimals": 18
  },
  "networkId": 74,
  "rpc": [
    "https://74.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://idchain.one/rpc/",
    "wss://idchain.one/ws/"
  ],
  "shortName": "idchain",
  "slug": "idchain",
  "testnet": false
} as const satisfies Chain;