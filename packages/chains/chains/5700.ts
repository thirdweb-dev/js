import type { Chain } from "../src/types";
export default {
  "chainId": 5700,
  "chain": "SYS",
  "name": "Syscoin Tanenbaum Testnet",
  "rpc": [
    "https://syscoin-tanenbaum-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tanenbaum.io",
    "wss://rpc.tanenbaum.io/wss",
    "https://syscoin-tanenbaum-evm.publicnode.com",
    "wss://syscoin-tanenbaum-evm.publicnode.com"
  ],
  "slug": "syscoin-tanenbaum-testnet",
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Syscoin Testnet Block Explorer",
      "url": "https://tanenbaum.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;