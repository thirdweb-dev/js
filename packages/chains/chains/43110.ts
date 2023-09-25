import type { Chain } from "../src/types";
export default {
  "chainId": 43110,
  "chain": "ATH",
  "name": "Athereum",
  "rpc": [
    "https://athereum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ava.network:21015/ext/evm/rpc"
  ],
  "slug": "athereum",
  "faucets": [
    "http://athfaucet.ava.network//?address=${ADDRESS}"
  ],
  "nativeCurrency": {
    "name": "Athereum Ether",
    "symbol": "ATH",
    "decimals": 18
  },
  "infoURL": "https://athereum.ava.network",
  "shortName": "avaeth",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;