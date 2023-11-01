import type { Chain } from "../src/types";
export default {
  "chain": "ENULS",
  "chainId": 119,
  "explorers": [
    {
      "name": "enulsscan",
      "url": "https://evmscan.nuls.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYz8LK5WkUN8UwqKfWUjnyLuYqQZWihT7J766YXft4TSy",
        "width": 26,
        "height": 41,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmYz8LK5WkUN8UwqKfWUjnyLuYqQZWihT7J766YXft4TSy",
    "width": 26,
    "height": 41,
    "format": "svg"
  },
  "infoURL": "https://nuls.io",
  "name": "ENULS Mainnet",
  "nativeCurrency": {
    "name": "NULS",
    "symbol": "NULS",
    "decimals": 18
  },
  "networkId": 119,
  "rpc": [
    "https://enuls.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://119.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmapi.nuls.io",
    "https://evmapi2.nuls.io"
  ],
  "shortName": "enuls",
  "slug": "enuls",
  "testnet": false
} as const satisfies Chain;