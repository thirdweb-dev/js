import type { Chain } from "../src/types";
export default {
  "chainId": 333,
  "chain": "Web3Q",
  "name": "Web3Q Mainnet",
  "rpc": [
    "https://web3q.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.web3q.io:8545"
  ],
  "slug": "web3q",
  "faucets": [],
  "nativeCurrency": {
    "name": "Web3Q",
    "symbol": "W3Q",
    "decimals": 18
  },
  "infoURL": "https://web3q.io/home.w3q/",
  "shortName": "w3q",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "w3q-mainnet",
      "url": "https://explorer.mainnet.web3q.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;