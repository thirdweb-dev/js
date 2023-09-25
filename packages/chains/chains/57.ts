import type { Chain } from "../src/types";
export default {
  "chainId": 57,
  "chain": "SYS",
  "name": "Syscoin Mainnet",
  "rpc": [
    "https://syscoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.syscoin.org",
    "https://rpc.ankr.com/syscoin/${ANKR_API_KEY}",
    "https://syscoin.public-rpc.com",
    "wss://rpc.syscoin.org/wss",
    "https://syscoin-evm.publicnode.com",
    "wss://syscoin-evm.publicnode.com"
  ],
  "slug": "syscoin",
  "faucets": [
    "https://faucet.syscoin.org"
  ],
  "nativeCurrency": {
    "name": "Syscoin",
    "symbol": "SYS",
    "decimals": 18
  },
  "infoURL": "https://www.syscoin.org",
  "shortName": "sys",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Syscoin Block Explorer",
      "url": "https://explorer.syscoin.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;