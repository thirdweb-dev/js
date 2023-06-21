import type { Chain } from "../src/types";
export default {
  "name": "Omni Testnet 1",
  "chain": "Omni",
  "rpc": [
    "https://omni-testnet-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-1.omni.network"
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
      "url": "https://testnet-1.explorer.omni.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "omni-testnet-1"
} as const satisfies Chain;