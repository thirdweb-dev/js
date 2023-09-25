import type { Chain } from "../src/types";
export default {
  "chainId": 1313114,
  "chain": "ETHO",
  "name": "Etho Protocol",
  "rpc": [
    "https://etho-protocol.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ethoprotocol.com"
  ],
  "slug": "etho-protocol",
  "faucets": [],
  "nativeCurrency": {
    "name": "Etho Protocol",
    "symbol": "ETHO",
    "decimals": 18
  },
  "infoURL": "https://ethoprotocol.com",
  "shortName": "etho",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.ethoprotocol.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;