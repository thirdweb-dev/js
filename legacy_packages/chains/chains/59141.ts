import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 59141,
  "explorers": [
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
    "https://rpc.sepolia.linea.build"
  ],
  "shortName": "linea-sepolia",
  "slug": "linea-sepolia",
  "testnet": true,
  "title": "Linea Sepolia Testnet"
} as const satisfies Chain;