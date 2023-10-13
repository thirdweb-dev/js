import type { Chain } from "../src/types";
export default {
  "chain": "ETI",
  "chainId": 101,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://einc.io",
  "name": "EtherInc",
  "nativeCurrency": {
    "name": "EtherInc Ether",
    "symbol": "ETI",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://etherinc.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.einc.io/jsonrpc/mainnet"
  ],
  "shortName": "eti",
  "slug": "etherinc",
  "testnet": false
} as const satisfies Chain;