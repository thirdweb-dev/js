import type { Chain } from "../src/types";
export default {
  "chain": "DIODE",
  "chainId": 13,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://diode.io/staging",
  "name": "Diode Testnet Staging",
  "nativeCurrency": {
    "name": "Staging Diodes",
    "symbol": "sDIODE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://diode-testnet-staging.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging.diode.io:8443/",
    "wss://staging.diode.io:8443/ws"
  ],
  "shortName": "dstg",
  "slug": "diode-testnet-staging",
  "testnet": true
} as const satisfies Chain;