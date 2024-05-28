import type { Chain } from "../src/types";
export default {
  "chain": "DoKEN Super Chain",
  "chainId": 61916,
  "explorers": [
    {
      "name": "DSC Scan",
      "url": "https://explore.doken.dev",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://doken.dev/",
  "name": "DoKEN Super Chain Mainnet",
  "nativeCurrency": {
    "name": "DoKEN",
    "symbol": "DKN",
    "decimals": 18
  },
  "networkId": 61916,
  "rpc": [
    "https://61916.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sgrpc.doken.dev",
    "https://nyrpc.doken.dev",
    "https://ukrpc.doken.dev"
  ],
  "shortName": "DoKEN",
  "slug": "doken-super-chain",
  "testnet": false
} as const satisfies Chain;