import type { Chain } from "../src/types";
export default {
  "chainId": 73,
  "chain": "FNCY",
  "name": "FNCY",
  "rpc": [
    "https://fncy.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fncy-seed1.fncy.world"
  ],
  "slug": "fncy",
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
  "infoURL": "https://fncyscan.fncy.world",
  "shortName": "FNCY",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "fncy scan",
      "url": "https://fncyscan.fncy.world",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;