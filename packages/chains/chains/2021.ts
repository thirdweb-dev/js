export default {
  "name": "Edgeware EdgeEVM Mainnet",
  "chain": "EDG",
  "icon": {
    "url": "ipfs://QmS3ERgAKYTmV7bSWcUPSvrrCC9wHQYxtZqEQYx9Rw4RGA",
    "width": 352,
    "height": 304,
    "format": "png"
  },
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
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Edgeware",
    "symbol": "EDG",
    "decimals": 18
  },
  "infoURL": "https://edgeware.io",
  "shortName": "edg",
  "chainId": 2021,
  "networkId": 2021,
  "slip44": 523,
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
      "icon": "subscan"
    }
  ],
  "testnet": false,
  "slug": "edgeware-edgeevm"
} as const;