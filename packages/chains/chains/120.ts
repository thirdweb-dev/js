import type { Chain } from "../src/types";
export default {
  "chain": "ENULS",
  "chainId": 120,
  "explorers": [
    {
      "name": "enulsscan",
      "url": "https://beta.evmscan.nuls.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "http://faucet.nuls.io"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmYz8LK5WkUN8UwqKfWUjnyLuYqQZWihT7J766YXft4TSy",
    "width": 26,
    "height": 41,
    "format": "svg"
  },
  "infoURL": "https://nuls.io",
  "name": "ENULS Testnet",
  "nativeCurrency": {
    "name": "NULS",
    "symbol": "NULS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://enuls-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beta.evmapi.nuls.io",
    "https://beta.evmapi2.nuls.io"
  ],
  "shortName": "enulst",
  "slug": "enuls-testnet",
  "testnet": true
} as const satisfies Chain;