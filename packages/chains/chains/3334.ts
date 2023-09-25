import type { Chain } from "../src/types";
export default {
  "chainId": 3334,
  "chain": "Web3Q",
  "name": "Web3Q Galileo",
  "rpc": [
    "https://web3q-galileo.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://galileo.web3q.io:8545"
  ],
  "slug": "web3q-galileo",
  "faucets": [],
  "nativeCurrency": {
    "name": "Web3Q",
    "symbol": "W3Q",
    "decimals": 18
  },
  "infoURL": "https://galileo.web3q.io/home.w3q/",
  "shortName": "w3q-g",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "w3q-galileo",
      "url": "https://explorer.galileo.web3q.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;