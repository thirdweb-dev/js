import type { Chain } from "../src/types";
export default {
  "chain": "XVM",
  "chainId": 4919,
  "explorers": [
    {
      "name": "Venidium Explorer",
      "url": "https://evm.venidiumexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreiaplwlym5g27jm4mjhotfqq6al2cxp3fnkmzdusqjg7wnipq5wn2e",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://venidium.io",
  "name": "Venidium Mainnet",
  "nativeCurrency": {
    "name": "Venidium",
    "symbol": "XVM",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://venidium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.venidium.io"
  ],
  "shortName": "xvm",
  "slug": "venidium",
  "testnet": false
} as const satisfies Chain;