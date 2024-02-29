import type { Chain } from "../src/types";
export default {
  "chain": "Web3Q",
  "chainId": 3333,
  "explorers": [
    {
      "name": "w3q-testnet",
      "url": "https://explorer.testnet.web3q.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://testnet.web3q.io/home.w3q/",
  "name": "Web3Q Testnet",
  "nativeCurrency": {
    "name": "Web3Q",
    "symbol": "W3Q",
    "decimals": 18
  },
  "networkId": 3333,
  "rpc": [
    "https://3333.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.web3q.io:8545"
  ],
  "shortName": "w3q-t",
  "slip44": 1,
  "slug": "web3q-testnet",
  "testnet": true
} as const satisfies Chain;