import type { Chain } from "../src/types";
export default {
  "chainId": 2021,
  "chain": "EDG",
  "name": "Edgeware EdgeEVM Mainnet",
  "rpc": [
    "https://edgeware-edgeevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://edgeware-evm.jelliedowl.net",
    "https://mainnet2.edgewa.re/evm",
    "https://mainnet3.edgewa.re/evm",
    "https://mainnet4.edgewa.re/evm",
    "https://mainnet5.edgewa.re/evm",
    "wss://edgeware.jelliedowl.net",
    "wss://mainnet2.edgewa.re",
    "wss://mainnet3.edgewa.re",
    "wss://mainnet4.edgewa.re",
    "wss://mainnet5.edgewa.re"
  ],
  "slug": "edgeware-edgeevm",
  "icon": {
    "url": "ipfs://QmS3ERgAKYTmV7bSWcUPSvrrCC9wHQYxtZqEQYx9Rw4RGA",
    "width": 352,
    "height": 304,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Edgeware",
    "symbol": "EDG",
    "decimals": 18
  },
  "infoURL": "https://edgeware.io",
  "shortName": "edg",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Edgscan by Bharathcoorg",
      "url": "https://edgscan.live",
      "standard": "EIP3091"
    },
    {
      "name": "Subscan",
      "url": "https://edgeware.subscan.io",
      "standard": "none"
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