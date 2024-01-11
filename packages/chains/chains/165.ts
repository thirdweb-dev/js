import type { Chain } from "../src/types";
export default {
  "chain": "Omni",
  "chainId": 165,
  "explorers": [
    {
      "name": "Omni Explorer",
      "url": "https://testnet.explorer.omni.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://docs.omni.network/",
  "name": "Omni Testnet",
  "nativeCurrency": {
    "name": "Omni",
    "symbol": "OMNI",
    "decimals": 18
  },
  "networkId": 165,
  "rpc": [
    "https://omni-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://165.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.omni.network"
  ],
  "shortName": "omni_testnet",
  "slip44": 1,
  "slug": "omni-testnet",
  "testnet": true
} as const satisfies Chain;