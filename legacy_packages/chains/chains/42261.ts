import type { Chain } from "../src/types";
export default {
  "chain": "Emerald",
  "chainId": 42261,
  "explorers": [
    {
      "name": "Oasis Emerald Testnet Explorer",
      "url": "https://explorer.oasis.io/testnet/emerald",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.testnet.oasis.io/"
  ],
  "infoURL": "https://docs.oasis.io/dapp/emerald",
  "name": "Oasis Emerald Testnet",
  "nativeCurrency": {
    "name": "Emerald Rose",
    "symbol": "ROSE",
    "decimals": 18
  },
  "networkId": 42261,
  "rpc": [
    "https://42261.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.emerald.oasis.io/",
    "wss://testnet.emerald.oasis.io/ws"
  ],
  "shortName": "emerald-testnet",
  "slip44": 1,
  "slug": "oasis-emerald-testnet",
  "testnet": true
} as const satisfies Chain;