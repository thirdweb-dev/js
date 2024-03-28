import type { Chain } from "../src/types";
export default {
  "chain": "MEMO",
  "chainId": 985,
  "explorers": [
    {
      "name": "Memo Mainnet Explorer",
      "url": "https://scan.metamemo.one:8080",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreig52paynhccs4o5ew6f7mk3xoqu2bqtitmfvlgnwarh2pm33gbdrq",
        "width": 128,
        "height": 128,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.metamemo.one/"
  ],
  "icon": {
    "url": "ipfs://bafkreig52paynhccs4o5ew6f7mk3xoqu2bqtitmfvlgnwarh2pm33gbdrq",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "name": "Memo Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "Memo",
    "symbol": "CMEMO",
    "decimals": 18
  },
  "networkId": 985,
  "rpc": [
    "https://985.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain.metamemo.one:8501",
    "wss://chain.metamemo.one:16801"
  ],
  "shortName": "memochain",
  "slug": "memo-smart-chain",
  "testnet": false
} as const satisfies Chain;