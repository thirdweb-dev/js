import type { Chain } from "../src/types";
export default {
  "chain": "NEAR",
  "chainId": 1313161554,
  "explorers": [
    {
      "name": "aurorascan.dev",
      "url": "https://aurorascan.dev",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://aurora.dev",
  "name": "Aurora Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1313161554,
  "rpc": [
    "https://aurora.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1313161554.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.aurora.dev"
  ],
  "shortName": "aurora",
  "slug": "aurora",
  "testnet": false
} as const satisfies Chain;