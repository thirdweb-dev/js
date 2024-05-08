import type { Chain } from "../src/types";
export default {
  "chain": "AIW3",
  "chainId": 2045,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreigfxcyvnx2r46a3unljb2auxeez5olbg56lbu4gkpa4me7wqoajjy",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://aiw3.io/",
  "name": "AIW3 Mainnet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 2045,
  "rpc": [],
  "shortName": "AIW3",
  "slug": "aiw3",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;