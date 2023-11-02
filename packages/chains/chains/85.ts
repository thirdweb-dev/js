import type { Chain } from "../src/types";
export default {
  "chain": "GTTEST",
  "chainId": 85,
  "explorers": [
    {
      "name": "GateScan",
      "url": "https://www.gatescan.org/testnet",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.gatescan.org/testnet/faucet"
  ],
  "infoURL": "https://www.gatechain.io",
  "name": "GateChain Testnet",
  "nativeCurrency": {
    "name": "GateToken",
    "symbol": "GT",
    "decimals": 18
  },
  "networkId": 85,
  "rpc": [
    "https://gatechain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://85.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.gatenode.cc"
  ],
  "shortName": "gttest",
  "slug": "gatechain-testnet",
  "testnet": true
} as const satisfies Chain;