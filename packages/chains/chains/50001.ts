import type { Chain } from "../src/types";
export default {
  "chain": "Liveplex OracleEVM Network",
  "chainId": 50001,
  "explorers": [],
  "faucets": [],
  "features": [],
  "name": "Liveplex OracleEVM",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://liveplex-oracleevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.oracle.liveplex.io"
  ],
  "shortName": "LOE",
  "slug": "liveplex-oracleevm",
  "testnet": false
} as const satisfies Chain;