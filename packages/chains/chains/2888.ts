import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 2888,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://testnet.bobascan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://boba.network",
  "name": "Boba Network Goerli Testnet",
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://boba-network-goerli-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli.boba.network/",
    "wss://wss.goerli.boba.network/"
  ],
  "shortName": "BobaGoerli",
  "slug": "boba-network-goerli-testnet",
  "testnet": true
} as const satisfies Chain;