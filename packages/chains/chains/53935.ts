import type { Chain } from "../src/types";
export default {
  "chain": "DFK",
  "chainId": 53935,
  "explorers": [
    {
      "name": "ethernal",
      "url": "https://explorer.dfkchain.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQB48m15TzhUFrmu56QCRQjkrkgUaKfgCmKE8o3RzmuPJ",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://defikingdoms.com",
  "name": "DFK Chain",
  "nativeCurrency": {
    "name": "Jewel",
    "symbol": "JEWEL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://dfk-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "DFK",
  "slug": "dfk-chain",
  "testnet": false
} as const satisfies Chain;