import type { Chain } from "../src/types";
export default {
  "chain": "SCS",
  "chainId": 1970,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.scschain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://scschain.com",
  "name": "Super Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "Super Chain Native Token",
    "symbol": "SCS",
    "decimals": 18
  },
  "networkId": 1970,
  "rpc": [
    "https://1970.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.scschain.com"
  ],
  "shortName": "scs",
  "slug": "super-smart-chain",
  "testnet": false
} as const satisfies Chain;