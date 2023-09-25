import type { Chain } from "../src/types";
export default {
  "chainId": 112358,
  "chain": "METAO",
  "name": "Metachain One Mainnet",
  "rpc": [
    "https://metachain-one.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.metachain.one",
    "https://rpc2.metachain.one"
  ],
  "slug": "metachain-one",
  "icon": {
    "url": "ipfs://QmTmo2QAtX5PbhX96vewnvH4Vc5H83Ft2DJGi6tAqTcFij",
    "width": 1000,
    "height": 981,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Metao",
    "symbol": "METAO",
    "decimals": 18
  },
  "infoURL": "https://metachain.one",
  "shortName": "metao",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.metachain.one",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;