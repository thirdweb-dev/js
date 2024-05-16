import type { Chain } from "../src/types";
export default {
  "chain": "WP",
  "chainId": 260693,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://Qmd4g9i2VjndV1TuWZySYoBiNt6eVyJMEujov7YtcTyoqq/whalepass_logo_3.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "name": "Whalepass Testnet",
  "nativeCurrency": {
    "name": "Whalepass",
    "symbol": "WP",
    "decimals": 18
  },
  "networkId": 260693,
  "redFlags": [],
  "rpc": [
    "https://260693.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fraa-flashbox-2684-rpc.a.stagenet.tanssi.network"
  ],
  "shortName": "wptest",
  "slug": "whalepass-testnet",
  "testnet": true
} as const satisfies Chain;