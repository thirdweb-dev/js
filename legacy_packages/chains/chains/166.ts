import type { Chain } from "../src/types";
export default {
  "chain": "Omni",
  "chainId": 166,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://docs.omni.network/",
  "name": "Omni",
  "nativeCurrency": {
    "name": "Omni",
    "symbol": "OMNI",
    "decimals": 18
  },
  "networkId": 166,
  "rpc": [],
  "shortName": "omni",
  "slip44": 1,
  "slug": "omni",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;