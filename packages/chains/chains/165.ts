import type { Chain } from "../src/types";
export default {
  "name": "Omni Testnet",
  "chain": "Omni",
  "rpc": [
    "https://omni-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.omni.network"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Omni",
    "symbol": "OMNI",
    "decimals": 18
  },
  "infoURL": "https://docs.omni.network/",
  "shortName": "omni_testnet",
  "chainId": 165,
  "networkId": 165,
  "explorers": [
    {
      "name": "Omni Explorer",
      "url": "https://testnet.explorer.omni.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "omni-testnet"
} as const satisfies Chain;