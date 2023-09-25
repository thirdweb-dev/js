import type { Chain } from "../src/types";
export default {
  "chainId": 1320,
  "chain": "AIA",
  "name": "AIA Testnet",
  "rpc": [
    "https://aia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://aia-dataseed1-testnet.aiachain.org"
  ],
  "slug": "aia-testnet",
  "icon": {
    "url": "ipfs://QmXbBMMhjTTGAGjmqMpJm3ufFrtdkfEXCFyXYgz7nnZzsy",
    "width": 160,
    "height": 160,
    "format": "png"
  },
  "faucets": [
    "https://aia-faucet-testnet.aiachain.org"
  ],
  "nativeCurrency": {
    "name": "AIA Testnet",
    "symbol": "AIA",
    "decimals": 18
  },
  "infoURL": "https://aiachain.org",
  "shortName": "aiatestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "AIA Chain Explorer Testnet",
      "url": "https://testnet.aiascan.com",
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