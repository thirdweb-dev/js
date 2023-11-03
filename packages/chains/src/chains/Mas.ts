import type { Chain } from "../types";
export default {
  "chain": "MAS",
  "chainId": 220315,
  "explorers": [
    {
      "name": "explorer masnet",
      "url": "https://explorer.masnet.ai",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmZ9njQhhKkpJKGnoYy6XTuDtk5CYiDFUd8atqWthqUT3Q",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "infoURL": "https://masterbank.org",
  "name": "Mas Mainnet",
  "nativeCurrency": {
    "name": "Master Bank",
    "symbol": "MAS",
    "decimals": 18
  },
  "networkId": 220315,
  "rpc": [
    "https://mas.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://220315.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://node.masnet.ai:8545"
  ],
  "shortName": "mas",
  "slug": "mas",
  "testnet": false
} as const satisfies Chain;