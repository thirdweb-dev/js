import type { Chain } from "../src/types";
export default {
  "chain": "SYS",
  "chainId": 5700,
  "explorers": [
    {
      "name": "Syscoin Testnet Block Explorer",
      "url": "https://tanenbaum.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.tanenbaum.io"
  ],
  "infoURL": "https://syscoin.org",
  "name": "Syscoin Tanenbaum Testnet",
  "nativeCurrency": {
    "name": "Testnet Syscoin",
    "symbol": "tSYS",
    "decimals": 18
  },
  "networkId": 5700,
  "rpc": [
    "https://5700.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tanenbaum.io",
    "wss://rpc.tanenbaum.io/wss",
    "https://syscoin-tanenbaum-evm-rpc.publicnode.com",
    "wss://syscoin-tanenbaum-evm-rpc.publicnode.com"
  ],
  "shortName": "tsys",
  "slip44": 1,
  "slug": "syscoin-tanenbaum-testnet",
  "testnet": true
} as const satisfies Chain;