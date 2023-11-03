import type { Chain } from "../types";
export default {
  "chain": "EOS",
  "chainId": 59,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://eosargentina.io",
  "name": "EOS EVM Legacy",
  "nativeCurrency": {
    "name": "EOS",
    "symbol": "EOS",
    "decimals": 18
  },
  "networkId": 59,
  "rpc": [
    "https://eos-evm-legacy.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://59.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.eosargentina.io"
  ],
  "shortName": "eos-legacy",
  "slug": "eos-evm-legacy",
  "status": "deprecated",
  "testnet": false
} as const satisfies Chain;