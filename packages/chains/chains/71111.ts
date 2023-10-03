import type { Chain } from "../src/types";
export default {
  "chain": "GuapcoinX",
  "chainId": 71111,
  "explorers": [
    {
      "name": "GuapcoinX Explorer",
      "url": "http://explorer.guapcoinx.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmcDTR7982VQKDDz2Mh4fZbnE9hn67MuFPWQv1MimCqPvB",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "infoURL": "https://guapcoin.org/",
  "name": "GuapcoinX",
  "nativeCurrency": {
    "name": "GuapcoinX",
    "symbol": "GuapX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://guapcoinx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.guapcoinx.com/",
    "https://rpc-mainnet-1.guapcoinx.com/",
    "https://rpc-mainnet-2.guapcoinx.com/"
  ],
  "shortName": "GuapX",
  "slug": "guapcoinx",
  "testnet": false
} as const satisfies Chain;