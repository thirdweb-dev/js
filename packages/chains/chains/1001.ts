import type { Chain } from "../src/types";
export default {
  "chainId": 1001,
  "chain": "KLAY",
  "name": "Klaytn Testnet Baobab",
  "rpc": [
    "https://klaytn-testnet-baobab.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.baobab.klaytn.net:8651"
  ],
  "slug": "klaytn-testnet-baobab",
  "faucets": [
    "https://baobab.wallet.klaytn.com/access?next=faucet"
  ],
  "nativeCurrency": {
    "name": "KLAY",
    "symbol": "KLAY",
    "decimals": 18
  },
  "infoURL": "https://www.klaytn.com/",
  "shortName": "Baobab",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;