import type { Chain } from "../src/types";
export default {
  "chainId": 1004,
  "chain": "T-EKTA",
  "name": "T-EKTA",
  "rpc": [
    "https://t-ekta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test.ekta.io:8545"
  ],
  "slug": "t-ekta",
  "icon": {
    "url": "ipfs://QmfMd564KUPK8eKZDwGCT71ZC2jMnUZqP6LCtLpup3rHH1",
    "width": 2100,
    "height": 2100,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "T-EKTA",
    "symbol": "T-EKTA",
    "decimals": 18
  },
  "infoURL": "https://www.ekta.io",
  "shortName": "t-ekta",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "test-ektascan",
      "url": "https://test.ektascan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;