import type { Chain } from "../src/types";
export default {
  "chain": "Web3Q",
  "chainId": 333,
  "explorers": [
    {
      "name": "w3q-mainnet",
      "url": "https://explorer.mainnet.web3q.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://web3q.io/home.w3q/",
  "name": "Web3Q Mainnet",
  "nativeCurrency": {
    "name": "Web3Q",
    "symbol": "W3Q",
    "decimals": 18
  },
  "networkId": 333,
  "rpc": [
    "https://333.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.web3q.io:8545"
  ],
  "shortName": "w3q",
  "slug": "web3q",
  "testnet": false
} as const satisfies Chain;