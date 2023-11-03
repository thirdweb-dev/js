import type { Chain } from "../types";
export default {
  "chain": "TBXN",
  "chainId": 4777,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-explorer.blackfort.network",
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
  "name": "BlackFort Exchange Network Testnet",
  "nativeCurrency": {
    "name": "BlackFort Testnet Token",
    "symbol": "TBXN",
    "decimals": 18
  },
  "networkId": 4777,
  "rpc": [
    "https://blackfort-exchange-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4777.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.blackfort.network/rpc"
  ],
  "shortName": "TBXN",
  "slug": "blackfort-exchange-network-testnet",
  "testnet": true
} as const satisfies Chain;