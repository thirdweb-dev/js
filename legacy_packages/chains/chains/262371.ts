import type { Chain } from "../src/types";
export default {
  "chain": "Eclat",
  "chainId": 262371,
  "explorers": [
    {
      "name": "Eclat Testnet Explorer",
      "url": "https://testnet-explorer.eclatscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.eclatscan.com"
  ],
  "infoURL": "https://testnet-explorer.eclatscan.com",
  "name": "Eclat Testnet",
  "nativeCurrency": {
    "name": "Eclat Testnet",
    "symbol": "ECLAT",
    "decimals": 18
  },
  "networkId": 262371,
  "rpc": [
    "https://262371.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.eclatscan.com"
  ],
  "shortName": "tECLAT",
  "slug": "eclat-testnet",
  "testnet": true
} as const satisfies Chain;