import type { Chain } from "../src/types";
export default {
  "chain": "GWT",
  "chainId": 71401,
  "explorers": [
    {
      "name": "GWScan Block Explorer",
      "url": "https://v1.testnet.gwscan.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://testnet.bridge.godwoken.io"
  ],
  "infoURL": "https://www.nervos.org",
  "name": "Godwoken Testnet v1",
  "nativeCurrency": {
    "name": "pCKB",
    "symbol": "pCKB",
    "decimals": 18
  },
  "networkId": 71401,
  "rpc": [
    "https://godwoken-testnet-v1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://71401.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://godwoken-testnet-v1.ckbapp.dev",
    "https://v1.testnet.godwoken.io/rpc"
  ],
  "shortName": "gw-testnet-v1",
  "slip44": 1,
  "slug": "godwoken-testnet-v1",
  "testnet": true
} as const satisfies Chain;