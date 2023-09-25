import type { Chain } from "../src/types";
export default {
  "chainId": 72,
  "chain": "DxChain",
  "name": "DxChain Testnet",
  "rpc": [
    "https://dxchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-http.dxchain.com"
  ],
  "slug": "dxchain-testnet",
  "faucets": [
    "https://faucet.dxscan.io"
  ],
  "nativeCurrency": {
    "name": "DxChain Testnet",
    "symbol": "DX",
    "decimals": 18
  },
  "infoURL": "https://testnet.dxscan.io/",
  "shortName": "dxc",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;