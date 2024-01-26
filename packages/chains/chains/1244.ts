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
  "networkId": 1244,
  "rpc": [
    "https://arc-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1244.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-test-1.archiechain.io"
  ],
  "shortName": "TARC",
  "slip44": 1,
  "slug": "arc-testnet",
  "testnet": true
} as const satisfies Chain;