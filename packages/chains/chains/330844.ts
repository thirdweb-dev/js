import type { Chain } from "../src/types";
export default {
  "name": "TTcoin Smart Chain Mainnet",
  "chain": "TSC",
  "icon": {
    "url": "ipfs://QmS7ipvvyZ16weG1DM7AZbi1v9ixYwU2FjP25Jj5jkLiuf",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://ttcoin-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.tscscan.com"
  ],
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
  "chainId": 330844,
  "networkId": 330844,
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
  "testnet": false,
  "slug": "ttcoin-smart-chain"
} as const satisfies Chain;