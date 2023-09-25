import type { Chain } from "../src/types";
export default {
  "chainId": 86,
  "chain": "GT",
  "name": "GateChain Mainnet",
  "rpc": [
    "https://gatechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.gatenode.cc"
  ],
  "slug": "gatechain",
  "faucets": [
    "https://www.gatescan.org/faucet"
  ],
  "nativeCurrency": {
    "name": "GateToken",
    "symbol": "GT",
    "decimals": 18
  },
  "infoURL": "https://www.gatechain.io",
  "shortName": "gt",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "GateScan",
      "url": "https://www.gatescan.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;