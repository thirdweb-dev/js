import type { Chain } from "../src/types";
export default {
  "chain": "EthStorage",
  "chainId": 3333,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://ethstorage.io/",
  "name": "EthStorage Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 3333,
  "rpc": [
    "https://3333.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.ethstorage.io:9540"
  ],
  "shortName": "es-t",
  "slip44": 1,
  "slug": "ethstorage-testnet",
  "testnet": true
} as const satisfies Chain;