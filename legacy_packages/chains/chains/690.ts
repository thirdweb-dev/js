import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 690,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.redstone.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://redstone.xyz",
  "name": "Redstone",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 690,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://redstone.xyz/deposit"
      }
    ]
  },
  "rpc": [
    "https://690.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.redstonechain.com",
    "wss://rpc.redstonechain.com"
  ],
  "shortName": "redstone",
  "slug": "redstone",
  "testnet": false
} as const satisfies Chain;