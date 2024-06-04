import type { Chain } from "../src/types";
export default {
  "chain": "Flag",
  "chainId": 147,
  "explorers": [
    {
      "name": "Flag Mainnet Explorer",
      "url": "https://flagscan.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeibcrxeavdxpwwmj4mc6hhp232nkrfbpvfpngcqux2v5rmoshycj3u",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://flagscan.xyz",
  "name": "Flag Mainnet",
  "nativeCurrency": {
    "name": "Flag",
    "symbol": "FLAG",
    "decimals": 18
  },
  "networkId": 147,
  "rpc": [
    "https://147.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.flagscan.xyz"
  ],
  "shortName": "FLAG",
  "slug": "flag",
  "testnet": false
} as const satisfies Chain;