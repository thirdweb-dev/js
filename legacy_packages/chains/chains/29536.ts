import type { Chain } from "../src/types";
export default {
  "chain": "KaiChain",
  "chainId": 29536,
  "explorers": [
    {
      "name": "KaiChain Explorer",
      "url": "https://testnet-explorer.kaichain.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.kaichain.net"
  ],
  "infoURL": "https://kaichain.net",
  "name": "KaiChain Testnet",
  "nativeCurrency": {
    "name": "KaiChain Testnet Native Token",
    "symbol": "KEC",
    "decimals": 18
  },
  "networkId": 29536,
  "rpc": [
    "https://29536.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.kaichain.net"
  ],
  "shortName": "tkec",
  "slug": "kaichain-testnet",
  "testnet": true
} as const satisfies Chain;