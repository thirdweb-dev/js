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
  "infoURL": "https://plian.org/",
  "name": "Plian Testnet Subchain 1",
  "nativeCurrency": {
    "name": "Plian Token",
    "symbol": "TPI",
    "decimals": 18
  },
  "networkId": 10067275,
  "parent": {
    "type": "L2",
    "chain": "eip155-16658437"
  },
  "rpc": [
    "https://plian-testnet-subchain-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://10067275.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.plian.io/child_test"
  ],
  "shortName": "plian-testnet-l2",
  "slip44": 1,
  "slug": "plian-testnet-subchain-1",
  "testnet": true
} as const satisfies Chain;