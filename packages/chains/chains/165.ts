import type { Chain } from "../src/types";
export default {
  "chainId": 165,
  "chain": "Omni",
  "name": "Omni Testnet",
  "rpc": [
    "https://omni-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.omni.network"
  ],
  "slug": "omni-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Omni",
    "symbol": "OMNI",
    "decimals": 18
  },
  "infoURL": "https://docs.omni.network/",
  "shortName": "omni_testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Omni Explorer",
      "url": "https://testnet.explorer.omni.network",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ]
} as const satisfies Chain;