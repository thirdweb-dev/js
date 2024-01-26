import type { Chain } from "../src/types";
export default {
  "chain": "DIODE",
  "chainId": 15,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://diode.io/prenet",
  "name": "Diode Prenet",
  "nativeCurrency": {
    "name": "Diodes",
    "symbol": "DIODE",
    "decimals": 18
  },
  "networkId": 15,
  "rpc": [
    "https://diode-prenet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://15.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://prenet.diode.io:8443/",
    "wss://prenet.diode.io:8443/ws"
  ],
  "shortName": "diode",
  "slug": "diode-prenet",
  "testnet": false
} as const satisfies Chain;