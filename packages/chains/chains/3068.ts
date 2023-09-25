import type { Chain } from "../src/types";
export default {
  "chainId": 3068,
  "chain": "BFC",
  "name": "Bifrost Mainnet",
  "rpc": [
    "https://bifrost.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-01.mainnet.thebifrost.io/rpc",
    "https://public-02.mainnet.thebifrost.io/rpc"
  ],
  "slug": "bifrost",
  "icon": {
    "url": "ipfs://QmcHvn2Wq91ULyEH5s3uHjosX285hUgyJHwggFJUd3L5uh",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Bifrost",
    "symbol": "BFC",
    "decimals": 18
  },
  "infoURL": "https://thebifrost.io",
  "shortName": "bfc",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer-thebifrost",
      "url": "https://explorer.mainnet.thebifrost.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;