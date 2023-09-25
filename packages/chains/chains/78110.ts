import type { Chain } from "../src/types";
export default {
  "chainId": 78110,
  "chain": "ETH",
  "name": "Firenze test network",
  "rpc": [
    "https://firenze-test-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ethnode.primusmoney.com/firenze"
  ],
  "slug": "firenze-test-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Firenze Ether",
    "symbol": "FIN",
    "decimals": 18
  },
  "infoURL": "https://primusmoney.com",
  "shortName": "firenze",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;