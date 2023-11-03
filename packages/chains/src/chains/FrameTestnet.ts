import type { Chain } from "../types";
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
    "url": "ipfs://QmTS1P9sh49zg5xL5BUsRLWDz3vVoJCtCNf9yN1TTnsuQ3",
    "width": 321,
    "height": 320,
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
    "https://frame-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://68840142.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.frame.xyz/http"
  ],
  "shortName": "frame-test",
  "slug": "frame-testnet",
  "testnet": true
} as const satisfies Chain;