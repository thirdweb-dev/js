import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 59140,
  "explorers": [
    {
      "name": "Etherscan",
      "url": "https://goerli.lineascan.build",
      "standard": "EIP3091"
    },
    {
      "name": "Blockscout",
      "url": "https://explorer.goerli.linea.build",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucetlink.to/goerli"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmURjritnHL7a8TwZgsFwp3f272DJmG5paaPtWDZ98QZwH",
    "width": 97,
    "height": 102,
    "format": "svg"
  },
  "infoURL": "https://linea.build",
  "name": "Linea Testnet",
  "nativeCurrency": {
    "name": "Linea Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://linea-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://linea-goerli.infura.io/v3/${INFURA_API_KEY}",
    "wss://linea-goerli.infura.io/ws/v3/${INFURA_API_KEY}",
    "https://rpc.goerli.linea.build",
    "wss://rpc.goerli.linea.build"
  ],
  "shortName": "linea-testnet",
  "slug": "linea-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;