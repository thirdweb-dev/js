import type { Chain } from "../src/types";
export default {
  "chain": "Xchain",
  "chainId": 31754,
  "explorers": [
    {
      "name": "Xchain Testnet Explorer",
      "url": "https://xchaintest.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://xchainfaucet.net"
  ],
  "icon": {
    "url": "ipfs://bafybeia5n537fj2mkfcwmjfwktkmqrcwef3affdodhxnvmkg2gkvmbv2ke",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://xchaintest.net",
  "name": "Xchain Testnet",
  "nativeCurrency": {
    "name": "Intdestcoin Testnet",
    "symbol": "INTD",
    "decimals": 18
  },
  "networkId": 31754,
  "rpc": [
    "https://31754.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.xchaintest.net"
  ],
  "shortName": "tINTD",
  "slug": "xchain-testnet",
  "testnet": true
} as const satisfies Chain;