import type { Chain } from "../src/types";
export default {
  "chainId": 101,
  "chain": "ETI",
  "name": "EtherInc",
  "rpc": [
    "https://etherinc.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.einc.io/jsonrpc/mainnet"
  ],
  "slug": "etherinc",
  "faucets": [],
  "nativeCurrency": {
    "name": "EtherInc Ether",
    "symbol": "ETI",
    "decimals": 18
  },
  "infoURL": "https://einc.io",
  "shortName": "eti",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;