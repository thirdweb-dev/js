import type { Chain } from "../src/types";
export default {
  "name": "Linea Testnet",
  "title": "Linea Goerli Testnet",
  "chain": "ETH",
  "rpc": [
    "https://linea-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.goerli.linea.build",
    "wss://rpc.goerli.linea.build",
    "https://linea-goerli.infura.io/v3/${INFURA_API_KEY}",
    "wss://linea-goerli.infura.io/v3/${INFURA_API_KEY}"
  ],
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
  "chainId": 59140,
  "networkId": 59140,
  "icon": {
    "url": "ipfs://QmURjritnHL7a8TwZgsFwp3f272DJmG5paaPtWDZ98QZwH",
    "width": 97,
    "height": 102,
    "format": "svg"
  },
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://goerli.hop.exchange/#/send?token=ETH&sourceNetwork=ethereum&destNetwork=linea"
      }
    ]
  },
  "explorers": [
    {
      "name": "blockscout",
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
  "status": "active",
  "testnet": true,
  "slug": "linea-testnet"
} as const satisfies Chain;