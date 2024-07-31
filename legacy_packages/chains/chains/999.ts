import type { Chain } from "../src/types";
export default {
  "chain": "WAN",
  "chainId": 999,
  "explorers": [
    {
      "name": "wanscan",
      "url": "https://testnet.wanscan.org",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmcRVHdG7Sr1f26DhkBwE1YuwFZXFjNth5S3TookXoyFaq",
        "width": 360,
        "height": 360,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmcRVHdG7Sr1f26DhkBwE1YuwFZXFjNth5S3TookXoyFaq",
    "width": 360,
    "height": 360,
    "format": "png"
  },
  "infoURL": "https://testnet.wanscan.org",
  "name": "Wanchain Testnet",
  "nativeCurrency": {
    "name": "Wancoin",
    "symbol": "WAN",
    "decimals": 18
  },
  "networkId": 999,
  "rpc": [
    "https://999.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gwan-ssl.wandevs.org:46891/"
  ],
  "shortName": "twan",
  "slip44": 1,
  "slug": "wanchain-testnet",
  "testnet": true
} as const satisfies Chain;