import type { Chain } from "../src/types";
export default {
  "chainId": 66,
  "chain": "okxchain",
  "name": "OKXChain Mainnet",
  "rpc": [
    "https://okxchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://exchainrpc.okex.org",
    "https://okc-mainnet.gateway.pokt.network/v1/lb/6275309bea1b320039c893ff"
  ],
  "slug": "okxchain",
  "faucets": [],
  "nativeCurrency": {
    "name": "OKXChain Global Utility Token",
    "symbol": "OKT",
    "decimals": 18
  },
  "infoURL": "https://www.okex.com/okc",
  "shortName": "okt",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/en/okc",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;