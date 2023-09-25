import type { Chain } from "../src/types";
export default {
  "chainId": 16507,
  "chain": "Genesys",
  "name": "Genesys Mainnet",
  "rpc": [
    "https://genesys.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.genesys.network"
  ],
  "slug": "genesys",
  "icon": {
    "url": "ipfs://bafkreie6nai3yhykcdlsyshn5lbcbyba5y7zwsqg6owcfek2urhoucr6rm",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Genesys",
    "symbol": "GSYS",
    "decimals": 18
  },
  "infoURL": "https://www.genesys.network/",
  "shortName": "Genesys",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "GchainExplorer",
      "url": "https://gchainexplorer.genesys.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;