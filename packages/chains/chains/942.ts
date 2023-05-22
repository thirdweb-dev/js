import type { Chain } from "../src/types";
export default {
  "name": "PulseChain Testnet v3",
  "shortName": "t3pls",
  "chain": "t3PLS",
  "chainId": 942,
  "networkId": 942,
  "infoURL": "https://pulsechain.com/",
  "rpc": [
    "https://pulsechain-testnet-v3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.v3.testnet.pulsechain.com/",
    "wss://rpc.v3.testnet.pulsechain.com/"
  ],
  "faucets": [
    "https://faucet.v3.testnet.pulsechain.com/"
  ],
  "nativeCurrency": {
    "name": "Test Pulse",
    "symbol": "tPLS",
    "decimals": 18
  },
  "testnet": true,
  "slug": "pulsechain-testnet-v3"
} as const satisfies Chain;