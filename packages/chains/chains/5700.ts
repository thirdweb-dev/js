import type { Chain } from "../src/types";
export default {
  "name": "Syscoin Tanenbaum Testnet",
  "chain": "SYS",
  "rpc": [
    "https://syscoin-tanenbaum-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tanenbaum.io",
    "wss://rpc.tanenbaum.io/wss",
    "https://syscoin-tanenbaum-evm.publicnode.com",
    "wss://syscoin-tanenbaum-evm.publicnode.com"
  ],
  "faucets": [
    "https://faucet.tanenbaum.io"
  ],
  "nativeCurrency": {
    "name": "Testnet Syscoin",
    "symbol": "tSYS",
    "decimals": 18
  },
  "infoURL": "https://syscoin.org",
  "shortName": "tsys",
  "chainId": 5700,
  "networkId": 5700,
  "explorers": [
    {
      "name": "Syscoin Testnet Block Explorer",
      "url": "https://tanenbaum.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "syscoin-tanenbaum-testnet"
} as const satisfies Chain;