import type { Chain } from "../src/types";
export default {
  "chainId": 3333,
  "chain": "Web3Q",
  "name": "Web3Q Testnet",
  "rpc": [
    "https://web3q-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.web3q.io:8545"
  ],
  "slug": "web3q-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Web3Q",
    "symbol": "W3Q",
    "decimals": 18
  },
  "infoURL": "https://testnet.web3q.io/home.w3q/",
  "shortName": "w3q-t",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "w3q-testnet",
      "url": "https://explorer.testnet.web3q.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;