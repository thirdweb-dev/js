import type { Chain } from "../src/types";
export default {
  "chainId": 910,
  "chain": "DBONE",
  "name": "DecentraBone Layer1 Testnet",
  "rpc": [
    "https://decentrabone-layer1-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://layer1test.decentrabone.com"
  ],
  "slug": "decentrabone-layer1-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "DecentraBone",
    "symbol": "DBONE",
    "decimals": 18
  },
  "infoURL": "https://decentrabone.com",
  "shortName": "DBONE",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;