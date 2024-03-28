import type { Chain } from "../src/types";
export default {
  "chain": "okxchain",
  "chainId": 66,
  "explorers": [
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/en/okc",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.okex.com/okc",
  "name": "OKXChain Mainnet",
  "nativeCurrency": {
    "name": "OKXChain Global Utility Token",
    "symbol": "OKT",
    "decimals": 18
  },
  "networkId": 66,
  "rpc": [
    "https://66.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://exchainrpc.okex.org",
    "https://okc-mainnet.gateway.pokt.network/v1/lb/6275309bea1b320039c893ff"
  ],
  "shortName": "okt",
  "slug": "okxchain",
  "testnet": false
} as const satisfies Chain;