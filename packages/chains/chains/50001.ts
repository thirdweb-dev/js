import type { Chain } from "../src/types";
export default {
  "chain": "Liveplex OracleEVM Network",
  "chainId": 50001,
  "explorers": [],
  "faucets": [],
  "name": "Liveplex OracleEVM",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 50001,
  "rpc": [
    "https://50001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.oracle.liveplex.io"
  ],
  "shortName": "LOE",
  "slug": "liveplex-oracleevm",
  "testnet": false
} as const satisfies Chain;