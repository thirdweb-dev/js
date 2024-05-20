import type { Chain } from "../src/types";
export default {
  "chain": "Omni",
  "chainId": 164,
  "explorers": [
    {
      "name": "Omni X-Explorer",
      "url": "https://explorer.testnet.omni.network",
      "standard": "none"
    },
    {
      "name": "Omni EVM Explorer on Blockscout",
      "url": "https://omni-testnet.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "Omni EVM Explorer on Routescan",
      "url": "https://testnet.omniscan.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://docs.omni.network",
  "name": "Omni Testnet",
  "nativeCurrency": {
    "name": "Omni",
    "symbol": "OMNI",
    "decimals": 18
  },
  "networkId": 164,
  "rpc": [
    "https://164.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.omni.network"
  ],
  "shortName": "omni_testnet",
  "slip44": 1,
  "slug": "omni-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;