import type { Chain } from "../src/types";
export default {
  "name": "AIA Testnet",
  "chain": "AIA",
  "icon": {
    "url": "ipfs://QmXbBMMhjTTGAGjmqMpJm3ufFrtdkfEXCFyXYgz7nnZzsy",
    "width": 160,
    "height": 160,
    "format": "png"
  },
  "rpc": [
    "https://aia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://aia-dataseed1-testnet.aiachain.org"
  ],
  "faucets": [
    "https://aia-faucet-testnet.aiachain.org"
  ],
  "nativeCurrency": {
    "name": "AIA Testnet",
    "symbol": "AIA",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://aiachain.org",
  "shortName": "aiatestnet",
  "chainId": 1320,
  "networkId": 1320,
  "explorers": [
    {
      "name": "AIA Chain Explorer Testnet",
      "url": "https://testnet.aiascan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "aia-testnet"
} as const satisfies Chain;