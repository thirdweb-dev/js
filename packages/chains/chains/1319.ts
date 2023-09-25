import type { Chain } from "../src/types";
export default {
  "chainId": 1319,
  "chain": "AIA",
  "name": "AIA Mainnet",
  "rpc": [
    "https://aia.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://aia-dataseed1.aiachain.org",
    "https://aia-dataseed2.aiachain.org",
    "https://aia-dataseed3.aiachain.org",
    "https://aia-dataseed4.aiachain.org"
  ],
  "slug": "aia",
  "icon": {
    "url": "ipfs://QmXbBMMhjTTGAGjmqMpJm3ufFrtdkfEXCFyXYgz7nnZzsy",
    "width": 160,
    "height": 160,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "AIA Mainnet",
    "symbol": "AIA",
    "decimals": 18
  },
  "infoURL": "https://aiachain.org/",
  "shortName": "aia",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "AIA Chain Explorer Mainnet",
      "url": "https://aiascan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;