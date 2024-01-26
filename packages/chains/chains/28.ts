import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 28,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://blockexplorer.rinkeby.boba.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://boba.network",
  "name": "Boba Network Rinkeby Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 28,
  "parent": {
    "type": "L2",
    "chain": "eip155-4",
    "bridges": [
      {
        "url": "https://gateway.rinkeby.boba.network"
      }
    ]
  },
  "rpc": [
    "https://boba-network-rinkeby-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://28.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rinkeby.boba.network/"
  ],
  "shortName": "BobaRinkeby",
  "slip44": 1,
  "slug": "boba-network-rinkeby-testnet",
  "testnet": true
} as const satisfies Chain;