import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 68840142,
  "explorers": [
    {
      "name": "Frame Testnet Explorer",
      "url": "https://explorer.testnet.frame.xyz/",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.triangleplatform.com/frame"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmRxeKFwBwrXyDksoN4NzNRp3R35s8pVnTBfBj4AJSCq5g",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://frame.xyz",
  "name": "Frame Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 68840142,
  "redFlags": [],
  "rpc": [
    "https://68840142.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.frame.xyz/http"
  ],
  "shortName": "frame-test",
  "slip44": 1,
  "slug": "frame-testnet",
  "testnet": true
} as const satisfies Chain;