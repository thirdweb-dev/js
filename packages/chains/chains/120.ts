import type { Chain } from "../src/types";
export default {
  "chainId": 120,
  "chain": "ENULS",
  "name": "ENULS Testnet",
  "rpc": [
    "https://enuls-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beta.evmapi.nuls.io",
    "https://beta.evmapi2.nuls.io"
  ],
  "slug": "enuls-testnet",
  "icon": {
    "url": "ipfs://QmYz8LK5WkUN8UwqKfWUjnyLuYqQZWihT7J766YXft4TSy",
    "width": 26,
    "height": 41,
    "format": "svg"
  },
  "faucets": [
    "http://faucet.nuls.io"
  ],
  "nativeCurrency": {
    "name": "NULS",
    "symbol": "NULS",
    "decimals": 18
  },
  "infoURL": "https://nuls.io",
  "shortName": "enulst",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "enulsscan",
      "url": "https://beta.evmscan.nuls.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;