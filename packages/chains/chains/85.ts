import type { Chain } from "../src/types";
export default {
  "chainId": 85,
  "chain": "GTTEST",
  "name": "GateChain Testnet",
  "rpc": [
    "https://gatechain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.gatenode.cc"
  ],
  "slug": "gatechain-testnet",
  "faucets": [
    "https://www.gatescan.org/testnet/faucet"
  ],
  "nativeCurrency": {
    "name": "GateToken",
    "symbol": "GT",
    "decimals": 18
  },
  "infoURL": "https://www.gatechain.io",
  "shortName": "gttest",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "GateScan",
      "url": "https://www.gatescan.org/testnet",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;