import type { Chain } from "../src/types";
export default {
  "chainId": 49088,
  "chain": "BFC",
  "name": "Bifrost Testnet",
  "rpc": [
    "https://bifrost-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-01.testnet.thebifrost.io/rpc",
    "https://public-02.testnet.thebifrost.io/rpc"
  ],
  "slug": "bifrost-testnet",
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
  "shortName": "tbfc",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer-thebifrost",
      "url": "https://explorer.testnet.thebifrost.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;