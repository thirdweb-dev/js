import type { Chain } from "../src/types";
export default {
  "chain": "OpenChain Testnet",
  "chainId": 776,
  "explorers": [
    {
      "name": "OPEN CHAIN TESTNET",
      "url": "https://testnet.openchain.info",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.openchain.info/"
  ],
  "infoURL": "https://testnet.openchain.info/",
  "name": "OpenChain Testnet",
  "nativeCurrency": {
    "name": "Openchain Testnet",
    "symbol": "TOPC",
    "decimals": 18
  },
  "networkId": 776,
  "rpc": [],
  "shortName": "opc",
  "slip44": 1,
  "slug": "openchain-testnet",
  "testnet": true
} as const satisfies Chain;