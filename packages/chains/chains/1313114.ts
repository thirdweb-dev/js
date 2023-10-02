import type { Chain } from "../src/types";
export default {
  "chain": "ETHO",
  "chainId": 1313114,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.ethoprotocol.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://ethoprotocol.com",
  "name": "Etho Protocol",
  "nativeCurrency": {
    "name": "Etho Protocol",
    "symbol": "ETHO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://etho-protocol.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ethoprotocol.com"
  ],
  "shortName": "etho",
  "slug": "etho-protocol",
  "testnet": false
} as const satisfies Chain;