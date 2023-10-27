import type { Chain } from "../src/types";
export default {
  "chain": "DBONE",
  "chainId": 910,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://decentrabone.com",
  "name": "DecentraBone Layer1 Testnet",
  "nativeCurrency": {
    "name": "DecentraBone",
    "symbol": "DBONE",
    "decimals": 18
  },
  "networkId": 910,
  "rpc": [
    "https://decentrabone-layer1-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://910.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://layer1test.decentrabone.com"
  ],
  "shortName": "DBONE",
  "slug": "decentrabone-layer1-testnet",
  "testnet": true
} as const satisfies Chain;