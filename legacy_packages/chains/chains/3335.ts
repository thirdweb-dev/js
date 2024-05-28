import type { Chain } from "../src/types";
export default {
  "chain": "EthStorage",
  "chainId": 3335,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://ethstorage.io/",
  "name": "EthStorage Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 3335,
  "rpc": [
    "https://3335.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://mainnet.ethstorage.io:9540"
  ],
  "shortName": "es-m",
  "slip44": 1,
  "slug": "ethstorage",
  "testnet": false
} as const satisfies Chain;