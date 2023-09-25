import type { Chain } from "../src/types";
export default {
  "chainId": 923018,
  "chain": "FNCY",
  "name": "FNCY Testnet",
  "rpc": [
    "https://fncy-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fncy-testnet-seed.fncy.world"
  ],
  "slug": "fncy-testnet",
  "icon": {
    "url": "ipfs://QmfXCh6UnaEHn3Evz7RFJ3p2ggJBRm9hunDHegeoquGuhD",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [
    "https://faucet-testnet.fncy.world"
  ],
  "nativeCurrency": {
    "name": "FNCY",
    "symbol": "FNCY",
    "decimals": 18
  },
  "infoURL": "https://fncyscan-testnet.fncy.world",
  "shortName": "tFNCY",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "fncy scan testnet",
      "url": "https://fncyscan-testnet.fncy.world",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;