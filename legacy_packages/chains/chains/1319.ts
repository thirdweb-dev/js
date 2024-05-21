import type { Chain } from "../src/types";
export default {
  "chain": "AIA",
  "chainId": 1319,
  "explorers": [
    {
      "name": "AIA Chain Explorer Mainnet",
      "url": "https://aiascan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmXbBMMhjTTGAGjmqMpJm3ufFrtdkfEXCFyXYgz7nnZzsy",
    "width": 160,
    "height": 160,
    "format": "png"
  },
  "infoURL": "https://aiachain.org/",
  "name": "AIA Mainnet",
  "nativeCurrency": {
    "name": "AIA Mainnet",
    "symbol": "AIA",
    "decimals": 18
  },
  "networkId": 1319,
  "rpc": [
    "https://1319.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://aia-dataseed1.aiachain.org",
    "https://aia-dataseed2.aiachain.org",
    "https://aia-dataseed3.aiachain.org",
    "https://aia-dataseed4.aiachain.org"
  ],
  "shortName": "aia",
  "slug": "aia",
  "testnet": false
} as const satisfies Chain;