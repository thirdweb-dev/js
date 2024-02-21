import type { Chain } from "../src/types";
export default {
  "chain": "t2bPLS",
  "chainId": 941,
  "explorers": [],
  "faucets": [
    "https://faucet.v2b.testnet.pulsechain.com/"
  ],
  "infoURL": "https://pulsechain.com/",
  "name": "PulseChain Testnet v2b",
  "nativeCurrency": {
    "name": "Test Pulse",
    "symbol": "tPLS",
    "decimals": 18
  },
  "networkId": 941,
  "rpc": [
    "https://941.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.v2b.testnet.pulsechain.com/",
    "wss://rpc.v2b.testnet.pulsechain.com/"
  ],
  "shortName": "t2bpls",
  "slip44": 1,
  "slug": "pulsechain-testnet-v2b",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;