import type { Chain } from "../src/types";
export default {
  "chain": "AIW3",
  "chainId": 1956,
  "explorers": [
    {
      "name": "aiw3 testnet scan",
      "url": "https://scan-testnet.aiw3.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreigfxcyvnx2r46a3unljb2auxeez5olbg56lbu4gkpa4me7wqoajjy",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://aiw3.io/",
  "name": "AIW3 Testnet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 1956,
  "rpc": [
    "https://1956.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.aiw3.io/"
  ],
  "shortName": "AIW3-Testnet",
  "slug": "aiw3-testnet",
  "testnet": true
} as const satisfies Chain;