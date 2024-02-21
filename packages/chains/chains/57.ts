import type { Chain } from "../src/types";
export default {
  "chain": "SYS",
  "chainId": 57,
  "explorers": [
    {
      "name": "Syscoin Block Explorer",
      "url": "https://explorer.syscoin.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.syscoin.org"
  ],
  "infoURL": "https://www.syscoin.org",
  "name": "Syscoin Mainnet",
  "nativeCurrency": {
    "name": "Syscoin",
    "symbol": "SYS",
    "decimals": 18
  },
  "networkId": 57,
  "rpc": [
    "https://57.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.syscoin.org",
    "https://rpc.ankr.com/syscoin/${ANKR_API_KEY}",
    "https://syscoin.public-rpc.com",
    "wss://rpc.syscoin.org/wss",
    "https://syscoin-evm-rpc.publicnode.com",
    "wss://syscoin-evm-rpc.publicnode.com"
  ],
  "shortName": "sys",
  "slug": "syscoin",
  "testnet": false
} as const satisfies Chain;