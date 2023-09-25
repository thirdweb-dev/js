import type { Chain } from "../src/types";
export default {
  "chainId": 15,
  "chain": "DIODE",
  "name": "Diode Prenet",
  "rpc": [
    "https://diode-prenet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://prenet.diode.io:8443/",
    "wss://prenet.diode.io:8443/ws"
  ],
  "slug": "diode-prenet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Diodes",
    "symbol": "DIODE",
    "decimals": 18
  },
  "infoURL": "https://diode.io/prenet",
  "shortName": "diode",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;