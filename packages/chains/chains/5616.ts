import type { Chain } from "../src/types";
export default {
  "chainId": 5616,
  "chain": "ARCTURUS",
  "name": "Arcturus Chain Testnet",
  "rpc": [
    "https://arcturus-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://185.99.196.3:8545"
  ],
  "slug": "arcturus-chain-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Test Arct",
    "symbol": "tARCT",
    "decimals": 18
  },
  "infoURL": "https://arcturuschain.io",
  "shortName": "ARCT",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;