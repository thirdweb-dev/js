import type { Chain } from "../src/types";
export default {
  "chain": "DxChain",
  "chainId": 72,
  "explorers": [],
  "faucets": [
    "https://faucet.dxscan.io"
  ],
  "features": [],
  "infoURL": "https://testnet.dxscan.io/",
  "name": "DxChain Testnet",
  "nativeCurrency": {
    "name": "DxChain Testnet",
    "symbol": "DX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://dxchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-http.dxchain.com"
  ],
  "shortName": "dxc",
  "slug": "dxchain-testnet",
  "testnet": true
} as const satisfies Chain;