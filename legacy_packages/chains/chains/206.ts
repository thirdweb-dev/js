import type { Chain } from "../src/types";
export default {
  "chain": "VinuChain Testnet",
  "chainId": 206,
  "explorers": [
    {
      "name": "VinuScan Testnet",
      "url": "https://testnet.vinuscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://vitainu.org",
  "name": "VinuChain Testnet",
  "nativeCurrency": {
    "name": "VinuChain",
    "symbol": "VC",
    "decimals": 18
  },
  "networkId": 206,
  "rpc": [
    "https://206.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://vinufoundation-rpc.com"
  ],
  "shortName": "VCTEST",
  "slip44": 1,
  "slug": "vinuchain-testnet",
  "testnet": true
} as const satisfies Chain;