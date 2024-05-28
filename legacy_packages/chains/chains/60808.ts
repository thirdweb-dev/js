import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 60808,
  "explorers": [
    {
      "name": "bobscout",
      "url": "https://explorer.gobob.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://gobob.xyz",
  "name": "BOB",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 60808,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://app.gobob.xyz"
      }
    ]
  },
  "rpc": [
    "https://60808.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gobob.xyz",
    "wss://rpc.gobob.xyz"
  ],
  "shortName": "bob",
  "slug": "bob",
  "status": "active",
  "testnet": false
} as const satisfies Chain;