import type { Chain } from "../src/types";
export default {
  "chain": "GT",
  "chainId": 86,
  "explorers": [
    {
      "name": "GateScan",
      "url": "https://www.gatescan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.gatescan.org/faucet"
  ],
  "infoURL": "https://www.gatechain.io",
  "name": "GateChain Mainnet",
  "nativeCurrency": {
    "name": "GateToken",
    "symbol": "GT",
    "decimals": 18
  },
  "networkId": 86,
  "rpc": [
    "https://gatechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://86.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.gatenode.cc"
  ],
  "shortName": "gt",
  "slug": "gatechain",
  "testnet": false
} as const satisfies Chain;