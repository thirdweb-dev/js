import type { Chain } from "../src/types";
export default {
  "chainId": 2606,
  "chain": "CRC",
  "name": "PoCRNet",
  "rpc": [
    "https://pocrnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pocrnet.westeurope.cloudapp.azure.com/http",
    "wss://pocrnet.westeurope.cloudapp.azure.com/ws"
  ],
  "slug": "pocrnet",
  "icon": {
    "url": "ipfs://QmRLwpq47tyEd3rfK4tKRhbTvyb3fc7PCutExnL1XAb37A",
    "width": 334,
    "height": 360,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Climate awaReness Coin",
    "symbol": "CRC",
    "decimals": 18
  },
  "infoURL": "https://github.com/ethereum-pocr/pocrnet",
  "shortName": "pocrnet",
  "testnet": false,
  "status": "active",
  "redFlags": [],
  "explorers": [
    {
      "name": "Lite Explorer",
      "url": "https://ethereum-pocr.github.io/explorer/pocrnet",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;