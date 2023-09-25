import type { Chain } from "../src/types";
export default {
  "chainId": 4919,
  "chain": "XVM",
  "name": "Venidium Mainnet",
  "rpc": [
    "https://venidium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.venidium.io"
  ],
  "slug": "venidium",
  "icon": {
    "url": "ipfs://bafkreiaplwlym5g27jm4mjhotfqq6al2cxp3fnkmzdusqjg7wnipq5wn2e",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Venidium",
    "symbol": "XVM",
    "decimals": 18
  },
  "infoURL": "https://venidium.io",
  "shortName": "xvm",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Venidium Explorer",
      "url": "https://evm.venidiumexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;