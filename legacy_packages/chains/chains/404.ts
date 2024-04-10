import type { Chain } from "../src/types";
export default {
  "chain": "SYNDR",
  "chainId": 404,
  "explorers": [
    {
      "name": "Syndr L3 Explorer",
      "url": "https://explorer.syndr.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreibsl7iuxeibovp7uddigbus3lyse2f7n4s2lomgvf33fmgyxjwq5i",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://syndr.com",
  "name": "Syndr L3",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 404,
  "parent": {
    "type": "L2",
    "chain": "eip155-42161",
    "bridges": [
      {
        "url": "https://bridge.syndr.com"
      }
    ]
  },
  "rpc": [
    "https://404.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.syndr.com",
    "wss://rpc.syndr.com/ws"
  ],
  "shortName": "syndr-l3",
  "slug": "syndr-l3",
  "testnet": false,
  "title": "Syndr L3 Rollup"
} as const satisfies Chain;