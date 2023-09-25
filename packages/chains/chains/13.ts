import type { Chain } from "../src/types";
export default {
  "chainId": 13,
  "chain": "DIODE",
  "name": "Diode Testnet Staging",
  "rpc": [
    "https://diode-testnet-staging.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging.diode.io:8443/",
    "wss://staging.diode.io:8443/ws"
  ],
  "slug": "diode-testnet-staging",
  "faucets": [],
  "nativeCurrency": {
    "name": "Staging Diodes",
    "symbol": "sDIODE",
    "decimals": 18
  },
  "infoURL": "https://diode.io/staging",
  "shortName": "dstg",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;