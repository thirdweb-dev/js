import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 59140,
  "explorers": [
    {
      "name": "Etherscan",
      "url": "https://goerli.lineascan.build",
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
      "url": "https://explorer.goerli.linea.build",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmURjritnHL7a8TwZgsFwp3f272DJmG5paaPtWDZ98QZwH",
        "width": 97,
        "height": 102,
        "format": "svg"
      }
    }
  ],
  "faucets": [
    "https://faucetlink.to/goerli"
  ],
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
  "networkId": 59140,
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://goerli.hop.exchange/#/send?token=ETH&sourceNetwork=ethereum&destNetwork=linea"
      }
    ]
  },
  "rpc": [
    "https://linea-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://59140.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.goerli.linea.build",
    "wss://rpc.goerli.linea.build",
    "https://linea-goerli.infura.io/v3/${INFURA_API_KEY}",
    "wss://linea-goerli.infura.io/ws/v3/${INFURA_API_KEY}"
  ],
  "shortName": "linea-testnet",
  "slug": "linea-testnet",
  "status": "active",
  "testnet": true,
  "title": "Linea Goerli Testnet"
} as const satisfies Chain;