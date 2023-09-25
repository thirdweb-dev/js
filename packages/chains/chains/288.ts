import type { Chain } from "../src/types";
export default {
  "chainId": 288,
  "chain": "ETH",
  "name": "Boba Network",
  "rpc": [
    "https://boba-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.boba.network",
    "https://replica.boba.network",
    "https://boba-ethereum.gateway.tenderly.co",
    "https://gateway.tenderly.co/public/boba-ethereum",
    "wss://boba-ethereum.gateway.tenderly.co/",
    "wss://gateway.tenderly.co/public/boba-ethereum"
  ],
  "slug": "boba-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "Boba",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;