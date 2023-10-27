import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 288,
  "explorers": [
    {
      "name": "Bobascan",
      "url": "https://bobascan.com",
      "standard": "none"
    },
    {
      "name": "Blockscout",
      "url": "https://blockexplorer.boba.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://boba.network",
  "name": "Boba Network",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 288,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://gateway.boba.network"
      }
    ]
  },
  "rpc": [
    "https://boba-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://288.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.boba.network",
    "https://replica.boba.network",
    "https://boba-ethereum.gateway.tenderly.co",
    "https://gateway.tenderly.co/public/boba-ethereum",
    "wss://boba-ethereum.gateway.tenderly.co/",
    "wss://gateway.tenderly.co/public/boba-ethereum"
  ],
  "shortName": "Boba",
  "slug": "boba-network",
  "testnet": false
} as const satisfies Chain;