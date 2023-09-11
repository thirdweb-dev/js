import type { Chain } from "../src/types";
export default {
  "name": "HashBit Mainnet",
  "chain": "HBIT",
  "rpc": [
    "https://hashbit.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.hashbit.org",
    "https://rpc.hashbit.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "HashBit Native Token",
    "symbol": "HBIT",
    "decimals": 18
  },
  "infoURL": "https://hashbit.org",
  "shortName": "hbit",
  "chainId": 11119,
  "networkId": 11119,
  "explorers": [
    {
      "name": "hashbitscan",
      "url": "https://explorer.hashbit.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "hashbit"
} as const satisfies Chain;