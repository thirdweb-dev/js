import type { Chain } from "../src/types";
export default {
  "chain": "KAVA",
  "chainId": 2221,
  "explorers": [
    {
      "name": "Kava Testnet Explorer",
      "url": "http://testnet.kavascan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.kava.io"
  ],
  "infoURL": "https://www.kava.io",
  "name": "Kava Testnet",
  "nativeCurrency": {
    "name": "TKava",
    "symbol": "TKAVA",
    "decimals": 18
  },
  "networkId": 2221,
  "rpc": [
    "https://kava-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2221.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.testnet.kava.io",
    "wss://wevm.testnet.kava.io"
  ],
  "shortName": "tkava",
  "slug": "kava-testnet",
  "testnet": true
} as const satisfies Chain;