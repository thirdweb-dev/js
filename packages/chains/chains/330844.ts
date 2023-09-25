import type { Chain } from "../src/types";
export default {
  "chainId": 330844,
  "chain": "TSC",
  "name": "TTcoin Smart Chain Mainnet",
  "rpc": [
    "https://ttcoin-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.tscscan.com"
  ],
  "slug": "ttcoin-smart-chain",
  "icon": {
    "url": "ipfs://QmS7ipvvyZ16weG1DM7AZbi1v9ixYwU2FjP25Jj5jkLiuf",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://faucet.tscscan.com"
  ],
  "nativeCurrency": {
    "name": "TTcoin",
    "symbol": "TC",
    "decimals": 18
  },
  "infoURL": "https://ttcoin.info/",
  "shortName": "tc",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "TTcoin Smart Chain Explorer",
      "url": "https://tscscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;