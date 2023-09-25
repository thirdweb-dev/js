import type { Chain } from "../src/types";
export default {
  "chainId": 59140,
  "chain": "ETH",
  "name": "Linea Testnet",
  "rpc": [
    "https://linea-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://linea-goerli.infura.io/v3/${INFURA_API_KEY}",
    "wss://linea-goerli.infura.io/ws/v3/${INFURA_API_KEY}",
    "https://rpc.goerli.linea.build",
    "wss://rpc.goerli.linea.build"
  ],
  "slug": "linea-testnet",
  "icon": {
    "url": "ipfs://QmURjritnHL7a8TwZgsFwp3f272DJmG5paaPtWDZ98QZwH",
    "width": 97,
    "height": 102,
    "format": "svg"
  },
  "faucets": [
    "https://faucetlink.to/goerli"
  ],
  "nativeCurrency": {
    "name": "Linea Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://linea.build",
  "shortName": "linea-testnet",
  "testnet": true,
  "status": "active",
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.goerli.linea.build",
      "standard": "EIP3091"
    },
    {
      "name": "Etherscan",
      "url": "https://goerli.lineascan.build",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;