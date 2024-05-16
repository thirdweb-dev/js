import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 810180,
  "explorers": [
    {
      "name": "zkLink Nova Block Explorer",
      "url": "https://explorer.zklink.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://zklink.io",
  "name": "zkLink Nova Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 810180,
  "parent": {
    "type": "L2",
    "chain": "eip155-59144",
    "bridges": [
      {
        "url": "https://portal.zklink.io"
      }
    ]
  },
  "rpc": [
    "https://810180.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.zklink.io",
    "wss://rpc.zklink.io"
  ],
  "shortName": "zklink-nova",
  "slip44": 1,
  "slug": "zklink-nova",
  "testnet": false
} as const satisfies Chain;