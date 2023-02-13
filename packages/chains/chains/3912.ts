export default {
  "name": "DRAC Network",
  "chain": "DRAC",
  "rpc": [
    "https://drac-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.dracscan.com/rpc"
  ],
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
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "chainId": 3912,
  "networkId": 3912,
  "icon": {
    "url": "ipfs://QmXbsQe7QsVFZJZdBmbZVvS6LgX9ZFoaTMBs9MiQXUzJTw",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "explorers": [
    {
      "name": "DRAC_Network Scan",
      "url": "https://www.dracscan.io",
      "icon": "DRAC",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "drac-network"
} as const;