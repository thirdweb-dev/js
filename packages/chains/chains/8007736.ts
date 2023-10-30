import type { Chain } from "../src/types";
export default {
  "chain": "Plian",
  "chainId": 8007736,
  "explorers": [
    {
      "name": "piscan",
      "url": "https://piscan.plian.org/child_0",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://plian.org",
  "name": "Plian Mainnet Subchain 1",
  "nativeCurrency": {
    "name": "Plian Token",
    "symbol": "PI",
    "decimals": 18
  },
  "networkId": 8007736,
  "parent": {
    "type": "L2",
    "chain": "eip155-2099156"
  },
  "rpc": [
    "https://plian-subchain-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8007736.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.plian.io/child_0"
  ],
  "shortName": "plian-mainnet-l2",
  "slug": "plian-subchain-1",
  "testnet": false
} as const satisfies Chain;