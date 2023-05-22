import type { Chain } from "../src/types";
export default {
  "name": "ARC Testnet",
  "chain": "ARC",
  "icon": {
    "url": "ipfs://bafybeiady63oqduls2pm4aaykzjhahblagokhnpsc5qeq5dmkxqelh7i2i",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://arc-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-test-1.archiechain.io"
  ],
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
  "chainId": 1244,
  "networkId": 1244,
  "explorers": [
    {
      "name": "archiescan",
      "url": "https://testnet.archiescan.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "arc-testnet"
} as const satisfies Chain;