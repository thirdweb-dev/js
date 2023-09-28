import type { Chain } from "../src/types";
export default {
  "name": "Stratos",
  "chain": "STOS",
  "rpc": [
    "https://stratos.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://web3-rpc.thestratos.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "STOS",
    "symbol": "STOS",
    "decimals": 18
  },
  "infoURL": "https://www.thestratos.org",
  "shortName": "stos-mainnet",
  "chainId": 2048,
  "networkId": 2048,
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
  "testnet": false,
  "slug": "stratos"
} as const satisfies Chain;