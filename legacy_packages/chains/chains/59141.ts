import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 59141,
  "explorers": [
    {
      "name": "Etherscan",
      "url": "https://sepolia.lineascan.build",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmURjritnHL7a8TwZgsFwp3f272DJmG5paaPtWDZ98QZwH",
        "width": 97,
        "height": 102,
        "format": "svg"
      }
    },
    {
      "name": "Blockscout",
      "url": "https://explorer.sepolia.linea.build",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmURjritnHL7a8TwZgsFwp3f272DJmG5paaPtWDZ98QZwH",
        "width": 97,
        "height": 102,
        "format": "svg"
      }
    },
    {
      "name": "blockscout",
      "url": "https://explorer.sepolia.linea.build/",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmURjritnHL7a8TwZgsFwp3f272DJmG5paaPtWDZ98QZwH",
        "width": 30,
        "height": 30,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmURjritnHL7a8TwZgsFwp3f272DJmG5paaPtWDZ98QZwH",
    "width": 30,
    "height": 30,
    "format": "svg"
  },
  "infoURL": "https://linea.build",
  "name": "Linea Sepolia",
  "nativeCurrency": {
    "name": "Linea Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 59141,
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": []
  },
  "redFlags": [],
  "rpc": [
    "https://59141.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://linea-sepolia.infura.io/v3/${INFURA_API_KEY}",
    "wss://linea-sepolia.infura.io/ws/v3/${INFURA_API_KEY}",
    "https://rpc.sepolia.linea.build",
    "wss://rpc.sepolia.linea.build"
  ],
  "shortName": "linea-sepolia",
  "slip44": 1,
  "slug": "linea-sepolia",
  "status": "active",
  "testnet": true,
  "title": "Linea Sepolia Testnet"
} as const satisfies Chain;