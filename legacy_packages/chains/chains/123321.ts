import type { Chain } from "../src/types";
export default {
  "chain": "Gemchain",
  "chainId": 123321,
  "explorers": [
    {
      "name": "Gemchain Scan",
      "url": "https://scan.gemchain.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://gemchain.org",
  "name": "Gemchain",
  "nativeCurrency": {
    "name": "GEM",
    "symbol": "GEM",
    "decimals": 18
  },
  "networkId": 123321,
  "rpc": [
    "https://123321.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.gemchain.org"
  ],
  "shortName": "gemchain",
  "slip44": 1,
  "slug": "gemchain",
  "testnet": false
} as const satisfies Chain;