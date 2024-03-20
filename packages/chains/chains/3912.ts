import type { Chain } from "../src/types";
export default {
  "chain": "DRAC",
  "chainId": 3912,
  "explorers": [
    {
      "name": "DRAC_Network Scan",
      "url": "https://www.dracscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.dracscan.io/faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmXbsQe7QsVFZJZdBmbZVvS6LgX9ZFoaTMBs9MiQXUzJTw",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://drac.io/",
  "name": "DRAC Network",
  "nativeCurrency": {
    "name": "DRAC",
    "symbol": "DRAC",
    "decimals": 18
  },
  "networkId": 3912,
  "rpc": [
    "https://3912.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.dracscan.com/rpc"
  ],
  "shortName": "drac",
  "slug": "drac-network",
  "testnet": false
} as const satisfies Chain;