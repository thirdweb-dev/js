import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 59144,
  "explorers": [
    {
      "name": "lineascan",
      "url": "https://lineascan.build",
      "standard": "EIP3091"
    },
    {
      "name": "Blockscout",
      "url": "https://explorer.linea.build",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmURjritnHL7a8TwZgsFwp3f272DJmG5paaPtWDZ98QZwH",
        "width": 97,
        "height": 102,
        "format": "svg"
      }
    },
    {
      "name": "L2scan",
      "url": "https://linea.l2scan.co",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmURjritnHL7a8TwZgsFwp3f272DJmG5paaPtWDZ98QZwH",
        "width": 97,
        "height": 102,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmURjritnHL7a8TwZgsFwp3f272DJmG5paaPtWDZ98QZwH",
    "width": 97,
    "height": 102,
    "format": "svg"
  },
  "infoURL": "https://linea.build",
  "name": "Linea",
  "nativeCurrency": {
    "name": "Linea Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 59144,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.linea.build"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://59144.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://linea-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "wss://linea-mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
    "https://rpc.linea.build",
    "wss://rpc.linea.build"
  ],
  "shortName": "linea",
  "slug": "linea",
  "status": "active",
  "testnet": false,
  "title": "Linea Mainnet"
} as const satisfies Chain;