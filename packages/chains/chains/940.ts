import type { Chain } from "../src/types";
export default {
  "chain": "tPLS",
  "chainId": 940,
  "explorers": [],
  "faucets": [
    "https://faucet.v2.testnet.pulsechain.com/"
  ],
  "infoURL": "https://pulsechain.com/",
  "name": "PulseChain Testnet",
  "nativeCurrency": {
    "name": "Test Pulse",
    "symbol": "tPLS",
    "decimals": 18
  },
  "networkId": 940,
  "rpc": [
    "https://pulsechain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://940.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.v2.testnet.pulsechain.com/",
    "wss://rpc.v2.testnet.pulsechain.com/"
  ],
  "shortName": "tpls",
  "slip44": 1,
  "slug": "pulsechain-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;