import type { Chain } from "../src/types";
export default {
  "chain": "KLAY",
  "chainId": 1001,
  "explorers": [],
  "faucets": [
    "https://baobab.wallet.klaytn.com/access?next=faucet"
  ],
  "features": [],
  "infoURL": "https://www.klaytn.com/",
  "name": "Klaytn Testnet Baobab",
  "nativeCurrency": {
    "name": "KLAY",
    "symbol": "KLAY",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://klaytn-testnet-baobab.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.baobab.klaytn.net:8651"
  ],
  "shortName": "Baobab",
  "slug": "klaytn-testnet-baobab",
  "testnet": true
} as const satisfies Chain;