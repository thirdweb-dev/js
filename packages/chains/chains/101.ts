import type { Chain } from "../src/types";
export default {
  "chain": "ETI",
  "chainId": 101,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://einc.io",
  "name": "EtherInc",
  "nativeCurrency": {
    "name": "EtherInc Ether",
    "symbol": "ETI",
    "decimals": 18
  },
  "networkId": 1,
  "rpc": [
    "https://101.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.einc.io/jsonrpc/mainnet"
  ],
  "shortName": "eti",
  "slip44": 464,
  "slug": "etherinc",
  "testnet": false
} as const satisfies Chain;