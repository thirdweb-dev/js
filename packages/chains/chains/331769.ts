import type { Chain } from "../src/types";
export default {
  "name": "ProofOfPepe Testnet",
  "chain": "POPTestnet",
  "shortName": "POPTestnet",
  "chainId": 331769,
  "testnet": true,
  "icon": {
    "format": "png",
    "url": "ipfs://QmP8rYvcc7aJB3c2YZxjxaySvHapHnoK8MnxuSuDT4PtF2",
    "height": 400,
    "width": 400
  },
  "rpc": [
    "https://proofofpepe-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet01.proofofpepe.tech"
  ],
  "nativeCurrency": {
    "name": "POP",
    "symbol": "POP",
    "decimals": 18
  },
  "explorers": [
    {
      "name": "ProofOfPepe Explorer",
      "url": "https://pepescan.app/",
      "standard": "EIP3091"
    }
  ],
  "slug": "proofofpepe-testnet"
} as const satisfies Chain;