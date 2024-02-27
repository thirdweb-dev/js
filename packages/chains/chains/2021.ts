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
      "standard": "none",
      "icon": {
        "url": "ipfs://Qma2GfW5nQHuA7nGqdEfwaXPL63G9oTwRTQKaGTfjNtM2W",
        "width": 400,
        "height": 400,
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
  "networkId": 2021,
  "rpc": [
    "https://2021.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
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
  "slip44": 523,
  "slug": "edgeware-edgeevm",
  "testnet": false
} as const satisfies Chain;