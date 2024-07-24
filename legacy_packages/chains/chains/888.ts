import type { Chain } from "../src/types";
export default {
  "chain": "WAN",
  "chainId": 888,
  "explorers": [
    {
      "name": "wanscan",
      "url": "https://wanscan.org",
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
  "infoURL": "https://www.wanscan.org",
  "name": "Wanchain",
  "nativeCurrency": {
    "name": "Wancoin",
    "symbol": "WAN",
    "decimals": 18
  },
  "networkId": 888,
  "rpc": [
    "https://888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gwan-ssl.wandevs.org:56891/"
  ],
  "shortName": "wan",
  "slip44": 5718350,
  "slug": "wanchain",
  "testnet": false
} as const satisfies Chain;