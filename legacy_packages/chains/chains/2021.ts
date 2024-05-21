import type { Chain } from "../src/types";
export default {
  "chain": "EDG",
  "chainId": 2021,
  "explorers": [
    {
      "name": "Edgscan EdgeEVM explorer by Bharathcoorg",
      "url": "https://edgscan.live",
      "standard": "EIP3091"
    },
    {
      "name": "Edgscan EdgeWASM explorer by Bharathcoorg",
      "url": "https://edgscan.ink",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmVV7ibcq8pS44Nt77jWSLNY2RkfQooHBCZMBPSMdAfZ3d",
        "width": 88,
        "height": 88,
        "format": "svg"
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
    "url": "ipfs://QmWCSXYLigYE6qEiese4cso2icgKQyosV3x1adtxJnRyJ9",
    "width": 88,
    "height": 76,
    "format": "svg"
  },
  "infoURL": "https://edgeware.io",
  "name": "Edgeware EdgeEVM Mainnet",
  "nativeCurrency": {
    "name": "Edgeware",
    "symbol": "EDG",
    "decimals": 18
  },
  "networkId": 2021,
  "rpc": [
    "https://2021.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://edgeware-evm.jelliedowl.net",
    "https://edgeware-evm0.jelliedowl.net",
    "https://edgeware-evm1.jelliedowl.net",
    "https://edgeware-evm2.jelliedowl.net",
    "https://edgeware-evm3.jelliedowl.net",
    "wss://edgeware.jelliedowl.net",
    "wss://edgeware-rpc0.jelliedowl.net",
    "wss://edgeware-rpc1.jelliedowl.net",
    "wss://edgeware-rpc2.jelliedowl.net",
    "wss://edgeware-rpc3.jelliedowl.net"
  ],
  "shortName": "edg",
  "slip44": 523,
  "slug": "edgeware-edgeevm",
  "testnet": false
} as const satisfies Chain;