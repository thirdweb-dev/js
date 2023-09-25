import type { Chain } from "../src/types";
export default {
  "chainId": 2048,
  "chain": "STOS",
  "name": "Stratos",
  "rpc": [
    "https://stratos.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://web3-rpc.thestratos.org"
  ],
  "slug": "stratos",
  "faucets": [],
  "nativeCurrency": {
    "name": "STOS",
    "symbol": "STOS",
    "decimals": 18
  },
  "infoURL": "https://www.thestratos.org",
  "shortName": "stos-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Stratos EVM Explorer (Blockscout)",
      "url": "https://web3-explorer.thestratos.org",
      "standard": "none"
    },
    {
      "name": "Stratos Cosmos Explorer (BigDipper)",
      "url": "https://explorer.thestratos.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;