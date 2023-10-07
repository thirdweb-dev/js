import type { Chain } from "../src/types";
export default {
  "chain": "ARC",
  "chainId": 1244,
  "explorers": [
    {
      "name": "archiescan",
      "url": "https://testnet.archiescan.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.archiechain.io"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://bafybeiady63oqduls2pm4aaykzjhahblagokhnpsc5qeq5dmkxqelh7i2i",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://archiechain.io/",
  "name": "ARC Testnet",
  "nativeCurrency": {
    "name": "ARC",
    "symbol": "ARC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://arc-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-test-1.archiechain.io"
  ],
  "shortName": "TARC",
  "slug": "arc-testnet",
  "testnet": true
} as const satisfies Chain;