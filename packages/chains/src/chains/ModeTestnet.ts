import type { Chain } from "../types";
export default {
  "chain": "ETH",
  "chainId": 919,
  "explorers": [
    {
      "name": "modescout",
      "url": "https://sepolia.explorer.mode.network",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://sepoliafaucet.com/"
  ],
  "icon": {
    "url": "ipfs://bafkreidi5y7afj5z4xrz7uz5rkg2mcsv2p2n4ui4g7q4k4ecdz65i2agou",
    "width": 2160,
    "height": 2160,
    "format": "png"
  },
  "infoURL": "https://docs.mode.network/",
  "name": "Mode Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 919,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge.mode.network/"
      }
    ]
  },
  "rpc": [
    "https://mode-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://919.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.mode.network"
  ],
  "shortName": "modesep",
  "slug": "mode-testnet",
  "testnet": true
} as const satisfies Chain;