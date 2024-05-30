import type { Chain } from "../src/types";
export default {
  "chain": "Deamchain",
  "chainId": 236,
  "explorers": [
    {
      "name": "Deamchain Testnet Explorer",
      "url": "https://testnet-scan.deamchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.deamchain.com"
  ],
  "infoURL": "https://deamchain.com",
  "name": "Deamchain Testnet",
  "nativeCurrency": {
    "name": "Deamchain Native Token",
    "symbol": "DEAM",
    "decimals": 18
  },
  "networkId": 236,
  "rpc": [
    "https://236.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.deamchain.com"
  ],
  "shortName": "deamtest",
  "slip44": 1,
  "slug": "deamchain-testnet",
  "testnet": true
} as const satisfies Chain;