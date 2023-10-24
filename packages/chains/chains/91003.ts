import type { Chain } from "../src/types";
export default {
  "chain": "WRLDS",
  "chainId": 91003,
  "explorers": [],
  "faucets": [
    "https://faucet.evm.worlds.dev.eclipsenetwork.xyz/request_neon"
  ],
  "features": [],
  "name": "Worlds Appchain",
  "nativeCurrency": {
    "name": "WRLDS",
    "symbol": "WRLDS",
    "decimals": 18
  },
  "networkId": 91003,
  "redFlags": [],
  "rpc": [
    "https://worlds-appchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://91003.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.evm.worlds.dev.eclipsenetwork.xyz/"
  ],
  "shortName": "WRLDS",
  "slug": "worlds-appchain",
  "testnet": true
} as const satisfies Chain;