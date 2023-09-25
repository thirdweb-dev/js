import type { Chain } from "../src/types";
export default {
  "chainId": 28,
  "chain": "ETH",
  "name": "Boba Network Rinkeby Testnet",
  "rpc": [
    "https://boba-network-rinkeby-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rinkeby.boba.network/"
  ],
  "slug": "boba-network-rinkeby-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "BobaRinkeby",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://blockexplorer.rinkeby.boba.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;