import type { Chain } from "../src/types";
export default {
  "chainId": 59144,
  "chain": "Linea Mainnet",
  "name": "Linea Mainnet",
  "rpc": [
    "https://linea.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://linea-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "https://rpc.linea.build"
  ],
  "slug": "linea",
  "icon": {
    "url": "ipfs://QmURjritnHL7a8TwZgsFwp3f272DJmG5paaPtWDZ98QZwH",
    "width": 97,
    "height": 102,
    "format": "svg"
  },
  "faucets": [
    "https://www.infura.io/faucet/linea"
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://docs.linea.build/overview",
  "shortName": "linea-mainnet",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;