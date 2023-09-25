import type { Chain } from "../src/types";
export default {
  "chainId": 3912,
  "chain": "DRAC",
  "name": "DRAC Network",
  "rpc": [
    "https://drac-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.dracscan.com/rpc"
  ],
  "slug": "drac-network",
  "icon": {
    "url": "ipfs://QmXbsQe7QsVFZJZdBmbZVvS6LgX9ZFoaTMBs9MiQXUzJTw",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [
    "https://www.dracscan.io/faucet"
  ],
  "nativeCurrency": {
    "name": "DRAC",
    "symbol": "DRAC",
    "decimals": 18
  },
  "infoURL": "https://drac.io/",
  "shortName": "drac",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "DRAC_Network Scan",
      "url": "https://www.dracscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;