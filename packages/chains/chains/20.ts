import type { Chain } from "../src/types";
export default {
  "chainId": 20,
  "chain": "ETH",
  "name": "Elastos Smart Chain",
  "rpc": [
    "https://elastos-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.elastos.io/eth"
  ],
  "slug": "elastos-smart-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Elastos",
    "symbol": "tELA",
    "decimals": 18
  },
  "infoURL": "https://www.elastos.org/",
  "shortName": "esc",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "elastos esc explorer",
      "url": "https://esc.elastos.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;