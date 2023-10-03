import type { Chain } from "../src/types";
export default {
  "chain": "MOVO",
  "chainId": 2049,
  "explorers": [
    {
      "name": "movoscan",
      "url": "https://movoscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmbYjhXYych49hP6WY7C27pLGmSigSN35XYyocd5ftBew7",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "infoURL": "https://movo.uk",
  "name": "Movo Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "Movo Smart Chain",
    "symbol": "MOVO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://movo-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://msc-rpc.movoscan.com",
    "https://msc-rpc.movochain.org",
    "https://msc-rpc.movoswap.com"
  ],
  "shortName": "movo",
  "slug": "movo-smart-chain",
  "testnet": false
} as const satisfies Chain;