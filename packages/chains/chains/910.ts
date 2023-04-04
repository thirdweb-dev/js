import type { Chain } from "../src/types";
export default {
  "name": "DecentraBone Layer1 Testnet",
  "chain": "DBONE",
  "rpc": [
    "https://decentrabone-layer1-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://layer1test.decentrabone.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DecentraBone",
    "symbol": "DBONE",
    "decimals": 18
  },
  "infoURL": "https://decentrabone.com",
  "shortName": "DBONE",
  "chainId": 910,
  "networkId": 910,
  "testnet": true,
  "slug": "decentrabone-layer1-testnet"
} as const satisfies Chain;