import type { Chain } from "../src/types";
export default {
  "name": "Genesys Mainnet",
  "chain": "Genesys",
  "icon": {
    "url": "ipfs://bafkreie6nai3yhykcdlsyshn5lbcbyba5y7zwsqg6owcfek2urhoucr6rm",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "rpc": [
    "https://genesys.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.genesys.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Genesys",
    "symbol": "GSYS",
    "decimals": 18
  },
  "infoURL": "https://www.genesys.network/",
  "shortName": "Genesys",
  "chainId": 16507,
  "networkId": 16507,
  "explorers": [
    {
      "name": "GchainExplorer",
      "url": "https://gchainexplorer.genesys.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "genesys"
} as const satisfies Chain;