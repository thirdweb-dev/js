import type { Chain } from "../src/types";
export default {
  "chain": "SIN",
  "chainId": 67390,
  "explorers": [
    {
      "name": "siriusnetscan",
      "url": "https://siriusnet.tryethernal.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://macaucasinolisboa.xyz",
  "name": "SiriusNet",
  "nativeCurrency": {
    "name": "MCD",
    "symbol": "MCD",
    "decimals": 18
  },
  "networkId": 67390,
  "rpc": [
    "https://67390.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://u0tnafcv6j:o2T045sxuCNXL878RDQLp5__Zj-es2cvdjtgkl4etn0@u0v7kwtvtg-u0wj114sve-rpc.us0-aws.kaleido.io/"
  ],
  "shortName": "mcl",
  "slug": "siriusnet",
  "status": "deprecated",
  "testnet": false
} as const satisfies Chain;