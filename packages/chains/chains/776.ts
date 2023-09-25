import type { Chain } from "../src/types";
export default {
  "chainId": 776,
  "chain": "OpenChain Testnet",
  "name": "OpenChain Testnet",
  "rpc": [],
  "slug": "openchain-testnet",
  "faucets": [
    "https://faucet.openchain.info/"
  ],
  "nativeCurrency": {
    "name": "Openchain Testnet",
    "symbol": "TOPC",
    "decimals": 18
  },
  "infoURL": "https://testnet.openchain.info/",
  "shortName": "opc",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "OPEN CHAIN TESTNET",
      "url": "https://testnet.openchain.info",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;