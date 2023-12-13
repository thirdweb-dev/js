import type { Chain } from "../src/types";
export default {
  "chain": "STOS",
  "chainId": 2048,
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
  "faucets": [],
  "infoURL": "https://www.thestratos.org",
  "name": "Stratos",
  "nativeCurrency": {
    "name": "STOS",
    "symbol": "STOS",
    "decimals": 18
  },
  "networkId": 2048,
  "rpc": [
    "https://stratos.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2048.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://web3-rpc.thestratos.org"
  ],
  "shortName": "stos-mainnet",
  "slug": "stratos",
  "testnet": false
} as const satisfies Chain;