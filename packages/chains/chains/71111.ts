import type { Chain } from "../src/types";
export default {
  "chainId": 71111,
  "chain": "GuapcoinX",
  "name": "GuapcoinX",
  "rpc": [
    "https://guapcoinx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.guapcoinx.com/",
    "https://rpc-mainnet-1.guapcoinx.com/",
    "https://rpc-mainnet-2.guapcoinx.com/"
  ],
  "slug": "guapcoinx",
  "icon": {
    "url": "ipfs://QmcDTR7982VQKDDz2Mh4fZbnE9hn67MuFPWQv1MimCqPvB",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "GuapcoinX",
    "symbol": "GuapX",
    "decimals": 18
  },
  "infoURL": "https://guapcoin.org/",
  "shortName": "GuapX",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "GuapcoinX Explorer",
      "url": "http://explorer.guapcoinx.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;