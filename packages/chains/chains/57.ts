import type { Chain } from "../src/types";
export default {
  "name": "Syscoin Mainnet",
  "chain": "SYS",
  "rpc": [
    "https://syscoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.syscoin.org",
    "https://rpc.ankr.com/syscoin/${ANKR_API_KEY}",
    "https://syscoin.public-rpc.com",
    "wss://rpc.syscoin.org/wss",
    "https://syscoin-evm.publicnode.com",
    "wss://syscoin-evm.publicnode.com"
  ],
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
  "chainId": 57,
  "networkId": 57,
  "explorers": [
    {
      "name": "Syscoin Block Explorer",
      "url": "https://explorer.syscoin.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "syscoin"
} as const satisfies Chain;