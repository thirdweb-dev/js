import type { Chain } from "../src/types";
export default {
  "chain": "DIODE",
  "chainId": 13,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://diode.io/staging",
  "name": "Diode Testnet Staging",
  "nativeCurrency": {
    "name": "Staging Diodes",
    "symbol": "sDIODE",
    "decimals": 18
  },
  "networkId": 13,
  "rpc": [
    "https://13.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging.diode.io:8443/",
    "wss://staging.diode.io:8443/ws"
  ],
  "shortName": "dstg",
  "slip44": 1,
  "slug": "diode-testnet-staging",
  "testnet": true
} as const satisfies Chain;