import type { Chain } from "../src/types";
export default {
  "chain": "EDG",
  "chainId": 2021,
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
    "url": "ipfs://QmS3ERgAKYTmV7bSWcUPSvrrCC9wHQYxtZqEQYx9Rw4RGA",
    "width": 352,
    "height": 304,
    "format": "png"
  },
  "infoURL": "https://edgeware.io",
  "name": "Edgeware EdgeEVM Mainnet",
  "nativeCurrency": {
    "name": "Edgeware",
    "symbol": "EDG",
    "decimals": 18
  },
  "redFlags": [],
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
  "shortName": "edg",
  "slug": "edgeware-edgeevm",
  "testnet": false
} as const satisfies Chain;