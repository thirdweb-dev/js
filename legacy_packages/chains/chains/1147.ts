import type { Chain } from "../src/types";
export default {
  "chain": "Flag",
  "chainId": 1147,
  "explorers": [
    {
      "name": "Flag Testnet Explorer",
      "url": "https://testnet-explorer.flagscan.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.flagscan.xyz"
  ],
  "icon": {
    "url": "ipfs://bafybeibcrxeavdxpwwmj4mc6hhp232nkrfbpvfpngcqux2v5rmoshycj3u",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://testnet-explorer.flagscan.xyz",
  "name": "Flag Testnet",
  "nativeCurrency": {
    "name": "Flag Testnet",
    "symbol": "FLAG",
    "decimals": 18
  },
  "networkId": 1147,
  "rpc": [
    "https://1147.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.flagscan.xyz"
  ],
  "shortName": "tFLAG",
  "slug": "flag-testnet",
  "testnet": true
} as const satisfies Chain;