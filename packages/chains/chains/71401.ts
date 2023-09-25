import type { Chain } from "../src/types";
export default {
  "chainId": 71401,
  "chain": "GWT",
  "name": "Godwoken Testnet v1",
  "rpc": [
    "https://godwoken-testnet-v1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://godwoken-testnet-v1.ckbapp.dev",
    "https://v1.testnet.godwoken.io/rpc"
  ],
  "slug": "godwoken-testnet-v1",
  "faucets": [
    "https://testnet.bridge.godwoken.io"
  ],
  "nativeCurrency": {
    "name": "pCKB",
    "symbol": "pCKB",
    "decimals": 18
  },
  "infoURL": "https://www.nervos.org",
  "shortName": "gw-testnet-v1",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "GWScan Block Explorer",
      "url": "https://v1.testnet.gwscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;