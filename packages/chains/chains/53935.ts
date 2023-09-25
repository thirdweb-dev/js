import type { Chain } from "../src/types";
export default {
  "chainId": 53935,
  "chain": "DFK",
  "name": "DFK Chain",
  "rpc": [
    "https://dfk-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "slug": "dfk-chain",
  "icon": {
    "url": "ipfs://QmQB48m15TzhUFrmu56QCRQjkrkgUaKfgCmKE8o3RzmuPJ",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Jewel",
    "symbol": "JEWEL",
    "decimals": 18
  },
  "infoURL": "https://defikingdoms.com",
  "shortName": "DFK",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "ethernal",
      "url": "https://explorer.dfkchain.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;