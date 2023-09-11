import type { Chain } from "../src/types";
export default {
  "name": "AIA Mainnet",
  "chain": "AIA",
  "icon": {
    "url": "ipfs://QmXbBMMhjTTGAGjmqMpJm3ufFrtdkfEXCFyXYgz7nnZzsy",
    "width": 160,
    "height": 160,
    "format": "png"
  },
  "rpc": [
    "https://aia.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://aia-dataseed1.aiachain.org",
    "https://aia-dataseed2.aiachain.org",
    "https://aia-dataseed3.aiachain.org",
    "https://aia-dataseed4.aiachain.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "AIA Mainnet",
    "symbol": "AIA",
    "decimals": 18
  },
  "infoURL": "https://aiachain.org/",
  "shortName": "aia",
  "chainId": 1319,
  "networkId": 1319,
  "explorers": [
    {
      "name": "AIA Chain Explorer Mainnet",
      "url": "https://aiascan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "aia"
} as const satisfies Chain;