import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 28882,
  "explorers": [
    {
      "name": "Bobascan",
      "url": "https://testnet.bobascan.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://www.l2faucet.com/boba"
  ],
  "infoURL": "https://boba.network",
  "name": "Boba Sepolia",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 28882,
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
    "https://28882.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.boba.network",
    "https://boba-sepolia.gateway.tenderly.co",
    "https://gateway.tenderly.co/public/boba-sepolia",
    "wss://boba-sepolia.gateway.tenderly.co/",
    "wss://gateway.tenderly.co/public/boba-sepolia"
  ],
  "shortName": "BobaSepolia",
  "slug": "boba-sepolia",
  "testnet": true
} as const satisfies Chain;