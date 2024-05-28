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
  "infoURL": "https://nuls.io",
  "name": "ENULS Testnet",
  "nativeCurrency": {
    "name": "NULS",
    "symbol": "NULS",
    "decimals": 18
  },
  "networkId": 120,
  "rpc": [
    "https://120.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beta.evmapi.nuls.io",
    "https://beta.evmapi2.nuls.io"
  ],
  "shortName": "enulst",
  "slip44": 1,
  "slug": "enuls-testnet",
  "testnet": true
} as const satisfies Chain;