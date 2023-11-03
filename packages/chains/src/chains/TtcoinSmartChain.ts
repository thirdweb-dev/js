import type { Chain } from "../types";
export default {
  "chain": "TSC",
  "chainId": 330844,
  "explorers": [
    {
      "name": "TTcoin Smart Chain Explorer",
      "url": "https://tscscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmS7ipvvyZ16weG1DM7AZbi1v9ixYwU2FjP25Jj5jkLiuf",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.tscscan.com"
  ],
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
  "networkId": 330844,
  "rpc": [
    "https://ttcoin-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://330844.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.tscscan.com"
  ],
  "shortName": "tc",
  "slug": "ttcoin-smart-chain",
  "testnet": false
} as const satisfies Chain;