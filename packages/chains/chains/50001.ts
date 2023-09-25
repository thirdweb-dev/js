import type { Chain } from "../src/types";
export default {
  "chainId": 50001,
  "chain": "Liveplex OracleEVM Network",
  "name": "Liveplex OracleEVM",
  "rpc": [
    "https://liveplex-oracleevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.oracle.liveplex.io"
  ],
  "slug": "liveplex-oracleevm",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "",
  "shortName": "LOE",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;