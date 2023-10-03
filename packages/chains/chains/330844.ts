import type { Chain } from "../src/types";
export default {
  "chain": "TSC",
  "chainId": 330844,
  "explorers": [
    {
      "name": "TTcoin Smart Chain Explorer",
      "url": "https://tscscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.tscscan.com"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmS7ipvvyZ16weG1DM7AZbi1v9ixYwU2FjP25Jj5jkLiuf",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://ttcoin.info/",
  "name": "TTcoin Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "TTcoin",
    "symbol": "TC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ttcoin-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.tscscan.com"
  ],
  "shortName": "tc",
  "slug": "ttcoin-smart-chain",
  "testnet": false
} as const satisfies Chain;