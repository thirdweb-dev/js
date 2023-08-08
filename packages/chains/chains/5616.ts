import type { Chain } from "../src/types";
export default {
  "name": "Arcturus Chain Testnet",
  "chain": "ARCTURUS",
  "rpc": [
    "https://arcturus-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://185.99.196.3:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Test Arct",
    "symbol": "tARCT",
    "decimals": 18
  },
  "infoURL": "https://arcturuschain.io",
  "shortName": "ARCT",
  "chainId": 5616,
  "networkId": 5616,
  "testnet": true,
  "slug": "arcturus-chain-testnet"
} as const satisfies Chain;