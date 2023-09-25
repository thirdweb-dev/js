import type { Chain } from "../src/types";
export default {
  "chainId": 1244,
  "chain": "ARC",
  "name": "ARC Testnet",
  "rpc": [
    "https://arc-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-test-1.archiechain.io"
  ],
  "slug": "arc-testnet",
  "icon": {
    "url": "ipfs://bafybeiady63oqduls2pm4aaykzjhahblagokhnpsc5qeq5dmkxqelh7i2i",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://faucet.archiechain.io"
  ],
  "nativeCurrency": {
    "name": "ARC",
    "symbol": "ARC",
    "decimals": 18
  },
  "infoURL": "https://archiechain.io/",
  "shortName": "TARC",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "archiescan",
      "url": "https://testnet.archiescan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;