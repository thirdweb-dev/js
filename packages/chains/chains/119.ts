import type { Chain } from "../src/types";
export default {
  "chainId": 119,
  "chain": "ENULS",
  "name": "ENULS Mainnet",
  "rpc": [
    "https://enuls.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmapi.nuls.io",
    "https://evmapi2.nuls.io"
  ],
  "slug": "enuls",
  "icon": {
    "url": "ipfs://QmYz8LK5WkUN8UwqKfWUjnyLuYqQZWihT7J766YXft4TSy",
    "width": 26,
    "height": 41,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "NULS",
    "symbol": "NULS",
    "decimals": 18
  },
  "infoURL": "https://nuls.io",
  "shortName": "enuls",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "enulsscan",
      "url": "https://evmscan.nuls.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;