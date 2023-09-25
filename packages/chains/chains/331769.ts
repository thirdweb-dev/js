import type { Chain } from "../src/types";
export default {
  "chainId": 331769,
  "chain": "POPTestnet",
  "name": "ProofOfPepe Testnet",
  "rpc": [
    "https://proofofpepe-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet01.proofofpepe.tech"
  ],
  "slug": "proofofpepe-testnet",
  "icon": {
    "url": "ipfs://QmP8rYvcc7aJB3c2YZxjxaySvHapHnoK8MnxuSuDT4PtF2",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "POP",
    "symbol": "POP",
    "decimals": 18
  },
  "shortName": "POPTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "ProofOfPepe Explorer",
      "url": "https://pepescan.app/",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;