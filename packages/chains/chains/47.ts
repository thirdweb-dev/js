import type { Chain } from "../src/types";
export default {
  "name": "Acria IntelliChain",
  "chain": "AIC",
  "rpc": [
    "https://acria-intellichain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://aic.acria.ai"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ACRIA",
    "symbol": "ACRIA",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://acria.ai",
  "shortName": "aic",
  "chainId": 47,
  "networkId": 47,
  "explorers": [
    {
      "name": "Acria IntelliChain-Explorer",
      "url": "https://explorer.acria.ai",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "acria-intellichain"
} as const satisfies Chain;