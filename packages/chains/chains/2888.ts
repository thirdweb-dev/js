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
  "infoURL": "https://boba.network",
  "name": "Boba Network Goerli Testnet",
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2888,
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://gateway.boba.network"
      }
    ]
  },
  "rpc": [
    "https://boba-network-goerli-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli.boba.network/",
    "wss://wss.goerli.boba.network/"
  ],
  "shortName": "BobaGoerli",
  "slip44": 1,
  "slug": "boba-network-goerli-testnet",
  "testnet": true
} as const satisfies Chain;