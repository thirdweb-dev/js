import type { Chain } from "../src/types";
export default {
  "chain": "Genesys",
  "chainId": 16507,
  "explorers": [
    {
      "name": "GchainExplorer",
      "url": "https://gchainexplorer.genesys.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreie6nai3yhykcdlsyshn5lbcbyba5y7zwsqg6owcfek2urhoucr6rm",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "infoURL": "https://www.genesys.network/",
  "name": "Genesys Mainnet",
  "nativeCurrency": {
    "name": "Genesys",
    "symbol": "GSYS",
    "decimals": 18
  },
  "networkId": 16507,
  "rpc": [
    "https://genesys.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://16507.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.genesys.network"
  ],
  "shortName": "Genesys",
  "slug": "genesys",
  "testnet": false
} as const satisfies Chain;