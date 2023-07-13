import type { Chain } from "../src/types";
export default {
  "name": "Metachain One Mainnet",
  "chain": "METAO",
  "icon": {
    "url": "ipfs://QmTmo2QAtX5PbhX96vewnvH4Vc5H83Ft2DJGi6tAqTcFij",
    "width": 1000,
    "height": 981,
    "format": "png"
  },
  "rpc": [
    "https://metachain-one.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.metachain.one",
    "https://rpc2.metachain.one"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Metao",
    "symbol": "METAO",
    "decimals": 18
  },
  "infoURL": "https://metachain.one",
  "shortName": "metao",
  "chainId": 112358,
  "networkId": 112358,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.metachain.one",
      "icon": {
        "url": "ipfs://bafybeifu5tpui7dk5cjoo54kde7pmuthvnl7sdykobuarsxgu7t2izurnq",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "metachain-one"
} as const satisfies Chain;