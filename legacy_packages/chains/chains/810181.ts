import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 810181,
  "explorers": [
    {
      "name": "zkLink Nova Block Explorer",
      "url": "https://sepolia.explorer.zklink.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://zklink.io",
  "name": "zkLink Nova Sepolia Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 810181,
  "parent": {
    "type": "L2",
    "chain": "eip155-59141",
    "bridges": [
      {
        "url": "https://sepolia.portal.zklink.io"
      }
    ]
  },
  "rpc": [
    "https://810181.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.rpc.zklink.io",
    "wss://sepolia.rpc.zklink.io"
  ],
  "shortName": "zklink-nova-sepolia",
  "slip44": 1,
  "slug": "zklink-nova-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;