import type { Chain } from "../types";
export default {
  "chain": "CRC",
  "chainId": 2606,
  "explorers": [
    {
      "name": "Lite Explorer",
      "url": "https://ethereum-pocr.github.io/explorer/pocrnet",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRLwpq47tyEd3rfK4tKRhbTvyb3fc7PCutExnL1XAb37A",
        "width": 334,
        "height": 360,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRLwpq47tyEd3rfK4tKRhbTvyb3fc7PCutExnL1XAb37A",
    "width": 334,
    "height": 360,
    "format": "png"
  },
  "infoURL": "https://github.com/ethereum-pocr/pocrnet",
  "name": "PoCRNet",
  "nativeCurrency": {
    "name": "Climate awaReness Coin",
    "symbol": "CRC",
    "decimals": 18
  },
  "networkId": 2606,
  "rpc": [
    "https://pocrnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2606.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pocrnet.westeurope.cloudapp.azure.com/http",
    "wss://pocrnet.westeurope.cloudapp.azure.com/ws"
  ],
  "shortName": "pocrnet",
  "slug": "pocrnet",
  "status": "active",
  "testnet": false,
  "title": "Proof of Climate awaReness mainnet"
} as const satisfies Chain;