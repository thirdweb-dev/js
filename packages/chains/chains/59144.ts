import type { Chain } from "../src/types";
export default {
  "chain": "Linea Mainnet",
  "chainId": 59144,
  "explorers": [
    {
      "name": "lineascan",
      "url": "https://lineascan.build",
      "standard": "EIP3091"
    },
    {
      "name": "Linea Scan",
      "url": "https://lineascan.build",
      "standard": ""
    }
  ],
  "faucets": [
    "https://www.infura.io/faucet/linea"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmURjritnHL7a8TwZgsFwp3f272DJmG5paaPtWDZ98QZwH",
    "width": 97,
    "height": 102,
    "format": "svg"
  },
  "infoURL": "https://docs.linea.build/overview",
  "name": "Linea Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://linea.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://linea-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "https://rpc.linea.build"
  ],
  "shortName": "linea-mainnet",
  "slug": "linea",
  "testnet": false
} as const satisfies Chain;