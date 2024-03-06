import type { Chain } from "../src/types";
export default {
  "chain": "X1",
  "chainId": 195,
  "explorers": [
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/x1-test",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.okx.com/x1/faucet"
  ],
  "features": [],
  "infoURL": "https://www.okx.com/x1",
  "name": "X1 Testnet",
  "nativeCurrency": {
    "name": "X1 Global Utility Token in testnet",
    "symbol": "OKB",
    "decimals": 18
  },
  "networkId": 195,
  "rpc": [
    "https://195.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testrpc.x1.tech",
    "https://x1testrpc.okx.com"
  ],
  "shortName": "tokb",
  "slip44": 1,
  "slug": "x1-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;