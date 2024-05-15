import type { Chain } from "../src/types";
export default {
  "chain": "Omni",
  "chainId": 165,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://docs.omni.network/",
  "name": "Omni Testnet (Deprecated)",
  "nativeCurrency": {
    "name": "Omni",
    "symbol": "OMNI",
    "decimals": 18
  },
  "networkId": 165,
  "rpc": [],
  "shortName": "omni_testnet_deprecated",
  "slip44": 1,
  "slug": "omni-testnet-deprecated",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;