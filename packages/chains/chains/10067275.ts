import type { Chain } from "../src/types";
export default {
  "chainId": 10067275,
  "chain": "Plian",
  "name": "Plian Testnet Subchain 1",
  "rpc": [
    "https://plian-testnet-subchain-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.plian.io/child_test"
  ],
  "slug": "plian-testnet-subchain-1",
  "faucets": [],
  "nativeCurrency": {
    "name": "Plian Token",
    "symbol": "PI",
    "decimals": 18
  },
  "infoURL": "https://plian.org/",
  "shortName": "plian-testnet-l2",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "piscan",
      "url": "https://testnet.plian.org/child_test",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;