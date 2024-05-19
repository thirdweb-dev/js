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
  "infoURL": "https://ttcoin.info/",
  "name": "TTcoin Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "TTcoin",
    "symbol": "TC",
    "decimals": 18
  },
  "networkId": 330844,
  "rpc": [
    "https://330844.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.tscscan.com"
  ],
  "shortName": "tc",
  "slug": "ttcoin-smart-chain",
  "testnet": false
} as const satisfies Chain;