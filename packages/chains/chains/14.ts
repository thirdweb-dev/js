import type { Chain } from "../src/types";
export default {
  "chain": "FLR",
  "chainId": 14,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://flare-explorer.flare.network",
      "standard": "EIP3091"
    },
    {
      "name": "flarescan",
      "url": "https://mainnet.flarescan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmbT52cCx4h1rcz6nXGfUPFdRyw1VfFMU8kKpY7YCtvUjs",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://flare.network",
  "name": "Flare Mainnet",
  "nativeCurrency": {
    "name": "Flare",
    "symbol": "FLR",
    "decimals": 18
  },
  "networkId": 14,
  "rpc": [
    "https://14.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://flare-api.flare.network/ext/C/rpc",
    "https://flare-bundler.etherspot.io",
    "https://rpc.ankr.com/flare",
    "https://rpc.ftso.au/flare",
    "https://flare.enosys.global/ext/C/rpc",
    "https://flare.solidifi.app/ext/C/rpc"
  ],
  "shortName": "flr",
  "slug": "flare",
  "testnet": false
} as const satisfies Chain;