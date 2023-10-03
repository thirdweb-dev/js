import type { Chain } from "../src/types";
export default {
  "chain": "EDI",
  "chainId": 211,
  "explorers": [],
  "faucets": [
    "http://faucet.freight.sh"
  ],
  "features": [],
  "infoURL": "https://freighttrust.com",
  "name": "Freight Trust Network",
  "nativeCurrency": {
    "name": "Freight Trust Native",
    "symbol": "0xF",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://freight-trust-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://13.57.207.168:3435",
    "https://app.freighttrust.net/ftn/${API_KEY}"
  ],
  "shortName": "EDI",
  "slug": "freight-trust-network",
  "testnet": false
} as const satisfies Chain;