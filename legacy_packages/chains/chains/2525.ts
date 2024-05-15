import type { Chain } from "../src/types";
export default {
  "chain": "inEVM",
  "chainId": 2525,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmU9KU1qgReJR7vyVxN5zwWB3nkhSs658ViArUjT7GCh4r",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "infoURL": "https://inevm.com",
  "name": "inEVM Mainnet",
  "nativeCurrency": {
    "name": "Injective",
    "symbol": "INJ",
    "decimals": 18
  },
  "networkId": 2525,
  "rpc": [
    "https://2525.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.rpc.inevm.com/http"
  ],
  "shortName": "inevm",
  "slug": "inevm",
  "status": "active",
  "testnet": false
} as const satisfies Chain;