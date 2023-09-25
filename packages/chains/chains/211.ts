import type { Chain } from "../src/types";
export default {
  "chainId": 211,
  "chain": "EDI",
  "name": "Freight Trust Network",
  "rpc": [
    "https://freight-trust-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://13.57.207.168:3435",
    "https://app.freighttrust.net/ftn/${API_KEY}"
  ],
  "slug": "freight-trust-network",
  "faucets": [
    "http://faucet.freight.sh"
  ],
  "nativeCurrency": {
    "name": "Freight Trust Native",
    "symbol": "0xF",
    "decimals": 18
  },
  "infoURL": "https://freighttrust.com",
  "shortName": "EDI",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;