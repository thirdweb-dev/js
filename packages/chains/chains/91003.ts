import type { Chain } from "../src/types";
export default {
  "name": "Worlds Appchain",
  "chain": "WRLDS",
  "shortName": "WRLDS",
  "chainId": 91003,
  "testnet": true,
  "rpc": [
    "https://worlds-appchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.evm.worlds.dev.eclipsenetwork.xyz/"
  ],
  "nativeCurrency": {
    "name": "WRLDS",
    "symbol": "WRLDS",
    "decimals": 18
  },
  "faucets": [
    "https://faucet.evm.worlds.dev.eclipsenetwork.xyz/request_neon"
  ],
  "slug": "worlds-appchain"
} as const satisfies Chain;