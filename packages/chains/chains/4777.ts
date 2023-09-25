import type { Chain } from "../src/types";
export default {
  "chainId": 4777,
  "chain": "TBXN",
  "name": "BlackFort Exchange Network Testnet",
  "rpc": [
    "https://blackfort-exchange-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.blackfort.network/rpc"
  ],
  "slug": "blackfort-exchange-network-testnet",
  "icon": {
    "url": "ipfs://QmPasA8xykRtJDivB2bcKDiRCUNWDPtfUTTKVAcaF2wVxC",
    "width": 1968,
    "height": 1968,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "BlackFort Testnet Token",
    "symbol": "TBXN",
    "decimals": 18
  },
  "infoURL": "https://blackfort.exchange",
  "shortName": "TBXN",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-explorer.blackfort.network",
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