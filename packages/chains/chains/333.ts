import type { Chain } from "../src/types";
export default {
  "name": "Web3Q Mainnet",
  "chain": "Web3Q",
  "rpc": [
    "https://web3q.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.web3q.io:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Web3Q",
    "symbol": "W3Q",
    "decimals": 18
  },
  "infoURL": "https://web3q.io/home.w3q/",
  "shortName": "w3q",
  "chainId": 333,
  "networkId": 333,
  "explorers": [
    {
      "name": "w3q-mainnet",
      "url": "https://explorer.mainnet.web3q.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "web3q"
} as const satisfies Chain;