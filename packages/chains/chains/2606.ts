import type { Chain } from "../src/types";
export default {
  "name": "PoCRNet",
  "title": "Proof of Climate awaReness mainnet",
  "chain": "CRC",
  "status": "active",
  "rpc": [
    "https://pocrnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pocrnet.westeurope.cloudapp.azure.com/http",
    "wss://pocrnet.westeurope.cloudapp.azure.com/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Climate awaReness Coin",
    "symbol": "CRC",
    "decimals": 18
  },
  "infoURL": "https://github.com/ethereum-pocr/pocrnet",
  "shortName": "pocrnet",
  "chainId": 2606,
  "networkId": 2606,
  "icon": {
    "url": "ipfs://QmRLwpq47tyEd3rfK4tKRhbTvyb3fc7PCutExnL1XAb37A",
    "width": 334,
    "height": 360,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Lite Explorer",
      "url": "https://ethereum-pocr.github.io/explorer/pocrnet",
      "icon": {
        "url": "ipfs://QmRLwpq47tyEd3rfK4tKRhbTvyb3fc7PCutExnL1XAb37A",
        "width": 334,
        "height": 360,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "pocrnet"
} as const satisfies Chain;