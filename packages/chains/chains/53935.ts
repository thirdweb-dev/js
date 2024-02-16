import type { Chain } from "../src/types";
export default {
  "chain": "DFK",
  "chainId": 53935,
  "explorers": [
    {
      "name": "ethernal",
      "url": "https://explorer.dfkchain.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
        "width": 1000,
        "height": 1628,
        "format": "png"
      }
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
  "networkId": 53935,
  "redFlags": [],
  "rpc": [
    "https://dfk-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://53935.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc",
    "https://avax-pokt.nodies.app/ext/bc/q2aTwKuyzgs8pynF7UXBZCU7DejbZbZ6EUyHr3JQzYgwNPUPi/rpc"
  ],
  "shortName": "DFK",
  "slug": "dfk-chain",
  "testnet": false
} as const satisfies Chain;