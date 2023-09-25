import type { Chain } from "../src/types";
export default {
  "chainId": 2888,
  "chain": "ETH",
  "name": "Boba Network Goerli Testnet",
  "rpc": [
    "https://boba-network-goerli-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli.boba.network/",
    "wss://wss.goerli.boba.network/"
  ],
  "slug": "boba-network-goerli-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "BobaGoerli",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://testnet.bobascan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;