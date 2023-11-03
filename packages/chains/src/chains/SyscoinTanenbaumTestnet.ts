import type { Chain } from "../types";
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
    "https://syscoin-tanenbaum-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5700.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tanenbaum.io",
    "wss://rpc.tanenbaum.io/wss",
    "https://syscoin-tanenbaum-evm.publicnode.com",
    "wss://syscoin-tanenbaum-evm.publicnode.com"
  ],
  "shortName": "tsys",
  "slug": "syscoin-tanenbaum-testnet",
  "testnet": true
} as const satisfies Chain;