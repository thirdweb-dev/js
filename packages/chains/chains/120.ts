import type { Chain } from "../src/types";
export default {
  "name": "ENULS Testnet",
  "chain": "ENULS",
  "rpc": [
    "https://enuls-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beta.evmapi.nuls.io",
    "https://beta.evmapi2.nuls.io"
  ],
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
  "chainId": 120,
  "networkId": 120,
  "icon": {
    "url": "ipfs://QmYz8LK5WkUN8UwqKfWUjnyLuYqQZWihT7J766YXft4TSy",
    "width": 26,
    "height": 41,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "enulsscan",
      "url": "https://beta.evmscan.nuls.io",
      "icon": {
        "url": "ipfs://QmYz8LK5WkUN8UwqKfWUjnyLuYqQZWihT7J766YXft4TSy",
        "width": 26,
        "height": 41,
        "format": "svg"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "enuls-testnet"
} as const satisfies Chain;