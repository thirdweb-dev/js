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
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://docs.omni.network",
  "name": "Omni Testnet (incubating)",
  "nativeCurrency": {
    "name": "Omni",
    "symbol": "OMNI",
    "decimals": 18
  },
  "networkId": 164,
  "rpc": [],
  "shortName": "omni_testnet_164",
  "slip44": 1,
  "slug": "omni-testnet-incubating",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;