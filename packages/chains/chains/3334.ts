import type { Chain } from "../src/types";
export default {
  "chain": "Web3Q",
  "chainId": 3334,
  "explorers": [
    {
      "name": "w3q-galileo",
      "url": "https://explorer.galileo.web3q.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://galileo.web3q.io/home.w3q/",
  "name": "Web3Q Galileo",
  "nativeCurrency": {
    "name": "Web3Q",
    "symbol": "W3Q",
    "decimals": 18
  },
  "networkId": 3334,
  "rpc": [
    "https://web3q-galileo.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3334.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://galileo.web3q.io:8545"
  ],
  "shortName": "w3q-g",
  "slug": "web3q-galileo",
  "testnet": false
} as const satisfies Chain;