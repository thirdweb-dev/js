import type { Chain } from "../src/types";
export default {
  "chain": "KLAY",
  "chainId": 1001,
  "explorers": [
    {
      "name": "klaytnscope",
      "url": "https://scope.klaytn.com",
      "standard": "EIP3091"
    }
  ],
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
  "networkId": 1001,
  "redFlags": [],
  "rpc": [
    "https://1001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.baobab.klaytn.net:8651"
  ],
  "shortName": "Baobab",
  "slip44": 1,
  "slug": "klaytn-testnet-baobab",
  "testnet": true
} as const satisfies Chain;