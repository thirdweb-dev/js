import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 20,
  "explorers": [
    {
      "name": "elastos esc explorer",
      "url": "https://esc.elastos.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.elastos.org/",
  "name": "Elastos Smart Chain",
  "nativeCurrency": {
    "name": "Elastos",
    "symbol": "ELA",
    "decimals": 18
  },
  "networkId": 20,
  "rpc": [
    "https://elastos-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://20.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.elastos.io/eth"
  ],
  "shortName": "esc",
  "slug": "elastos-smart-chain",
  "testnet": false
} as const satisfies Chain;