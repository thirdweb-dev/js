import type { Chain } from "../src/types";
export default {
  "chain": "ARCTURUS",
  "chainId": 5616,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://arcturuschain.io",
  "name": "Arcturus Chain Testnet",
  "nativeCurrency": {
    "name": "Test Arct",
    "symbol": "tARCT",
    "decimals": 18
  },
  "networkId": 5616,
  "rpc": [
    "https://5616.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://185.99.196.3:8545"
  ],
  "shortName": "ARCT",
  "slip44": 1,
  "slug": "arcturus-chain-testnet",
  "testnet": true
} as const satisfies Chain;