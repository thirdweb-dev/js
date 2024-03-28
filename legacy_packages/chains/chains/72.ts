import type { Chain } from "../src/types";
export default {
  "chain": "DxChain",
  "chainId": 72,
  "explorers": [],
  "faucets": [
    "https://faucet.dxscan.io"
  ],
  "infoURL": "https://testnet.dxscan.io/",
  "name": "DxChain Testnet",
  "nativeCurrency": {
    "name": "DxChain Testnet",
    "symbol": "DX",
    "decimals": 18
  },
  "networkId": 72,
  "rpc": [
    "https://72.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-http.dxchain.com"
  ],
  "shortName": "dxc",
  "slip44": 1,
  "slug": "dxchain-testnet",
  "testnet": true
} as const satisfies Chain;