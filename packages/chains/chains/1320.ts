import type { Chain } from "../src/types";
export default {
  "chain": "AIA",
  "chainId": 1320,
  "explorers": [
    {
      "name": "AIA Chain Explorer Testnet",
      "url": "https://testnet.aiascan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://aia-faucet-testnet.aiachain.org"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmXbBMMhjTTGAGjmqMpJm3ufFrtdkfEXCFyXYgz7nnZzsy",
    "width": 160,
    "height": 160,
    "format": "png"
  },
  "infoURL": "https://aiachain.org",
  "name": "AIA Testnet",
  "nativeCurrency": {
    "name": "AIA Testnet",
    "symbol": "AIA",
    "decimals": 18
  },
  "networkId": 1320,
  "rpc": [
    "https://aia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1320.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://aia-dataseed1-testnet.aiachain.org"
  ],
  "shortName": "aiatestnet",
  "slip44": 1,
  "slug": "aia-testnet",
  "testnet": true
} as const satisfies Chain;