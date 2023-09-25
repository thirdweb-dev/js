import type { Chain } from "../src/types";
export default {
  "chainId": 985,
  "chain": "MEMO",
  "name": "Memo Smart Chain Mainnet",
  "rpc": [
    "https://memo-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain.metamemo.one:8501",
    "wss://chain.metamemo.one:16801"
  ],
  "slug": "memo-smart-chain",
  "icon": {
    "url": "ipfs://bafkreig52paynhccs4o5ew6f7mk3xoqu2bqtitmfvlgnwarh2pm33gbdrq",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "faucets": [
    "https://faucet.metamemo.one/"
  ],
  "nativeCurrency": {
    "name": "Memo",
    "symbol": "CMEMO",
    "decimals": 18
  },
  "infoURL": null,
  "shortName": "memochain",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Memo Mainnet Explorer",
      "url": "https://scan.metamemo.one:8080",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;