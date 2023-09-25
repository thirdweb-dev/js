import type { Chain } from "../src/types";
export default {
  "chainId": 335,
  "chain": "DFK",
  "name": "DFK Chain Test",
  "rpc": [
    "https://dfk-chain-test.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain-testnet/rpc"
  ],
  "slug": "dfk-chain-test",
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
  "shortName": "DFKTEST",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "ethernal",
      "url": "https://explorer-test.dfkchain.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;