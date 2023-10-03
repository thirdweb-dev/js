import type { Chain } from "../src/types";
export default {
  "chain": "ATH",
  "chainId": 43110,
  "explorers": [],
  "faucets": [
    "http://athfaucet.ava.network//?address=${ADDRESS}"
  ],
  "features": [],
  "infoURL": "https://athereum.ava.network",
  "name": "Athereum",
  "nativeCurrency": {
    "name": "Athereum Ether",
    "symbol": "ATH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://athereum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ava.network:21015/ext/evm/rpc"
  ],
  "shortName": "avaeth",
  "slug": "athereum",
  "testnet": false
} as const satisfies Chain;