import type { Chain } from "../src/types";
export default {
  "chainId": 11119,
  "chain": "HBIT",
  "name": "HashBit Mainnet",
  "rpc": [
    "https://hashbit.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.hashbit.org",
    "https://rpc.hashbit.org"
  ],
  "slug": "hashbit",
  "faucets": [],
  "nativeCurrency": {
    "name": "HashBit Native Token",
    "symbol": "HBIT",
    "decimals": 18
  },
  "infoURL": "https://hashbit.org",
  "shortName": "hbit",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "hashbitscan",
      "url": "https://explorer.hashbit.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;