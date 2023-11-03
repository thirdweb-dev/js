import type { Chain } from "../types";
export default {
  "chain": "t3PLS",
  "chainId": 942,
  "explorers": [],
  "faucets": [
    "https://faucet.v3.testnet.pulsechain.com/"
  ],
  "infoURL": "https://pulsechain.com/",
  "name": "PulseChain Testnet v3",
  "nativeCurrency": {
    "name": "Test Pulse",
    "symbol": "tPLS",
    "decimals": 18
  },
  "networkId": 942,
  "rpc": [
    "https://pulsechain-testnet-v3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://942.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.v3.testnet.pulsechain.com/",
    "wss://rpc.v3.testnet.pulsechain.com/"
  ],
  "shortName": "t3pls",
  "slug": "pulsechain-testnet-v3",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;