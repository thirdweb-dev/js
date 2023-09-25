import type { Chain } from "../src/types";
export default {
  "chainId": 4999,
  "chain": "BXN",
  "name": "BlackFort Exchange Network",
  "rpc": [
    "https://blackfort-exchange-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.blackfort.network/rpc",
    "https://mainnet-1.blackfort.network/rpc",
    "https://mainnet-2.blackfort.network/rpc",
    "https://mainnet-3.blackfort.network/rpc"
  ],
  "slug": "blackfort-exchange-network",
  "icon": {
    "url": "ipfs://QmPasA8xykRtJDivB2bcKDiRCUNWDPtfUTTKVAcaF2wVxC",
    "width": 1968,
    "height": 1968,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "BlackFort Token",
    "symbol": "BXN",
    "decimals": 18
  },
  "infoURL": "https://blackfort.exchange",
  "shortName": "BXN",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.blackfort.network",
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