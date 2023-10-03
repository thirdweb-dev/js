import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 78110,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://primusmoney.com",
  "name": "Firenze test network",
  "nativeCurrency": {
    "name": "Firenze Ether",
    "symbol": "FIN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://firenze-test-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ethnode.primusmoney.com/firenze"
  ],
  "shortName": "firenze",
  "slug": "firenze-test-network",
  "testnet": true
} as const satisfies Chain;