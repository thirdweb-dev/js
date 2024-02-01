import type { Chain } from "../src/types";
export default {
  "chain": "SYNDRSEPOLIA",
  "chainId": 444444,
  "explorers": [
    {
      "name": "Syndr L3 Sepolia Testnet Explorer",
      "url": "https://sepolia-explorer.syndr.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://syndr.com",
  "name": "Syndr L3 Sepolia",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 444444,
  "parent": {
    "type": "L2",
    "chain": "eip155-421614",
    "bridges": [
      {
        "url": "https://sepolia-bridge.syndr.com"
      }
    ]
  },
  "rpc": [
    "https://syndr-l3-sepolia.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://444444.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.syndr.com/http",
    "wss://sepolia.syndr.com/ws"
  ],
  "shortName": "syndr",
  "slug": "syndr-l3-sepolia",
  "testnet": true,
  "title": "Syndr L3 Sepolia Rollup Testnet"
} as const satisfies Chain;