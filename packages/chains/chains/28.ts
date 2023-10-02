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
  "features": [],
  "infoURL": "https://boba.network",
  "name": "Boba Network Rinkeby Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://boba-network-rinkeby-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rinkeby.boba.network/"
  ],
  "shortName": "BobaRinkeby",
  "slug": "boba-network-rinkeby-testnet",
  "testnet": true
} as const satisfies Chain;