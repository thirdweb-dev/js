import type { Chain } from "../src/types";
export default {
  "chain": "TAPROOT CHAIN",
  "chainId": 911,
  "explorers": [
    {
      "name": "TAPROOT Scan",
      "url": "https://scan.taprootchain.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmeucqvcreQk8nnSRUiHo3QTvLoYYB7shJTKXj5Tk6BtWi",
        "width": 100,
        "height": 100,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmeucqvcreQk8nnSRUiHo3QTvLoYYB7shJTKXj5Tk6BtWi",
    "width": 100,
    "height": 100,
    "format": "png"
  },
  "infoURL": "https://taprootchain.io",
  "name": "TAPROOT Mainnet",
  "nativeCurrency": {
    "name": "TBTC",
    "symbol": "TBTC",
    "decimals": 18
  },
  "networkId": 911,
  "rpc": [
    "https://911.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.taprootchain.io"
  ],
  "shortName": "TAPROOT-Mainnet",
  "slug": "taproot",
  "testnet": false,
  "title": "TAPROOT Mainnet"
} as const satisfies Chain;