import type { Chain } from "../src/types";
export default {
  "chainId": 220315,
  "chain": "MAS",
  "name": "Mas Mainnet",
  "rpc": [
    "https://mas.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://node.masnet.ai:8545"
  ],
  "slug": "mas",
  "icon": {
    "url": "ipfs://QmZ9njQhhKkpJKGnoYy6XTuDtk5CYiDFUd8atqWthqUT3Q",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Master Bank",
    "symbol": "MAS",
    "decimals": 18
  },
  "infoURL": "https://masterbank.org",
  "shortName": "mas",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer masnet",
      "url": "https://explorer.masnet.ai",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;