import type { Chain } from "../src/types";
export default {
  "chainId": 91003,
  "chain": "WRLDS",
  "name": "Worlds Appchain",
  "rpc": [
    "https://worlds-appchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.evm.worlds.dev.eclipsenetwork.xyz/"
  ],
  "slug": "worlds-appchain",
  "faucets": [
    "https://faucet.evm.worlds.dev.eclipsenetwork.xyz/request_neon"
  ],
  "nativeCurrency": {
    "name": "WRLDS",
    "symbol": "WRLDS",
    "decimals": 18
  },
  "shortName": "WRLDS",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;