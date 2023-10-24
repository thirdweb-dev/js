import type { Chain } from "../src/types";
export default {
  "chain": "BFC",
  "chainId": 49088,
  "explorers": [
    {
      "name": "explorer-thebifrost",
      "url": "https://explorer.testnet.thebifrost.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmcHvn2Wq91ULyEH5s3uHjosX285hUgyJHwggFJUd3L5uh",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "infoURL": "https://thebifrost.io",
  "name": "Bifrost Testnet",
  "nativeCurrency": {
    "name": "Bifrost",
    "symbol": "BFC",
    "decimals": 18
  },
  "networkId": 49088,
  "rpc": [
    "https://bifrost-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://49088.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-01.testnet.thebifrost.io/rpc",
    "https://public-02.testnet.thebifrost.io/rpc"
  ],
  "shortName": "tbfc",
  "slug": "bifrost-testnet",
  "testnet": true,
  "title": "Bifrost Network Testnet"
} as const satisfies Chain;