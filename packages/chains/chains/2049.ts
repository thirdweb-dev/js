import type { Chain } from "../src/types";
export default {
  "name": "Movo Smart Chain Mainnet",
  "chain": "MOVO",
  "rpc": [
    "https://movo-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://msc-rpc.movoscan.com",
    "https://msc-rpc.movochain.org",
    "https://msc-rpc.movoswap.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Movo Smart Chain",
    "symbol": "MOVO",
    "decimals": 18
  },
  "infoURL": "https://movo.uk",
  "shortName": "movo",
  "chainId": 2049,
  "networkId": 2049,
  "slip44": 2050,
  "icon": {
    "url": "ipfs://QmbYjhXYych49hP6WY7C27pLGmSigSN35XYyocd5ftBew7",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "explorers": [
    {
      "name": "movoscan",
      "url": "https://movoscan.com",
      "icon": {
        "url": "ipfs://QmPqa6cJ92t4eQMgYxmVs6yr8t53ZgzchRDwz2zd2VFUwF",
        "width": 256,
        "height": 256,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "movo-smart-chain"
} as const satisfies Chain;