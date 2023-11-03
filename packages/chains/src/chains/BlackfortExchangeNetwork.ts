import type { Chain } from "../types";
export default {
  "chain": "BXN",
  "chainId": 4999,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.blackfort.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmPasA8xykRtJDivB2bcKDiRCUNWDPtfUTTKVAcaF2wVxC",
    "width": 1968,
    "height": 1968,
    "format": "png"
  },
  "infoURL": "https://blackfort.exchange",
  "name": "BlackFort Exchange Network",
  "nativeCurrency": {
    "name": "BlackFort Token",
    "symbol": "BXN",
    "decimals": 18
  },
  "networkId": 4999,
  "rpc": [
    "https://blackfort-exchange-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4999.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.blackfort.network/rpc",
    "https://mainnet-1.blackfort.network/rpc",
    "https://mainnet-2.blackfort.network/rpc",
    "https://mainnet-3.blackfort.network/rpc"
  ],
  "shortName": "BXN",
  "slug": "blackfort-exchange-network",
  "testnet": false
} as const satisfies Chain;