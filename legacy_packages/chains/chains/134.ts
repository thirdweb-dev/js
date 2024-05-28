import type { Chain } from "../src/types";
export default {
  "chain": "Bellecour",
  "chainId": 134,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.bellecour.iex.ec",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://iex.ec",
  "name": "iExec Sidechain",
  "nativeCurrency": {
    "name": "xRLC",
    "symbol": "xRLC",
    "decimals": 18
  },
  "networkId": 134,
  "rpc": [
    "https://134.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bellecour.iex.ec"
  ],
  "shortName": "rlc",
  "slug": "iexec-sidechain",
  "testnet": false
} as const satisfies Chain;