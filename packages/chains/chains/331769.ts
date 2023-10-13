import type { Chain } from "../src/types";
export default {
  "chain": "POPTestnet",
  "chainId": 331769,
  "explorers": [
    {
      "name": "ProofOfPepe Explorer",
      "url": "https://pepescan.app/",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmP8rYvcc7aJB3c2YZxjxaySvHapHnoK8MnxuSuDT4PtF2",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "name": "ProofOfPepe Testnet",
  "nativeCurrency": {
    "name": "POP",
    "symbol": "POP",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://proofofpepe-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet01.proofofpepe.tech"
  ],
  "shortName": "POPTestnet",
  "slug": "proofofpepe-testnet",
  "testnet": true
} as const satisfies Chain;