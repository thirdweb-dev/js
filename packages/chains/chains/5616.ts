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
    "https://arcturus-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5616.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://185.99.196.3:8545"
  ],
  "shortName": "ARCT",
  "slug": "arcturus-chain-testnet",
  "testnet": true
} as const satisfies Chain;