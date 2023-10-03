import type { Chain } from "../src/types";
export default {
  "chain": "Plian",
  "chainId": 10067275,
  "explorers": [
    {
      "name": "piscan",
      "url": "https://testnet.plian.org/child_test",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://plian.org/",
  "name": "Plian Testnet Subchain 1",
  "nativeCurrency": {
    "name": "Plian Token",
    "symbol": "PI",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://plian-testnet-subchain-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.plian.io/child_test"
  ],
  "shortName": "plian-testnet-l2",
  "slug": "plian-testnet-subchain-1",
  "testnet": true
} as const satisfies Chain;