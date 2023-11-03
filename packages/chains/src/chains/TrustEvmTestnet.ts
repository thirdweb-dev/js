import type { Chain } from "../types";
export default {
  "chain": "Trust EVM Testnet",
  "chainId": 15555,
  "explorers": [
    {
      "name": "Trust EVM Explorer",
      "url": "https://trustscan.one",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.testnet-dev.trust.one/"
  ],
  "infoURL": "https://www.trust.one/",
  "name": "Trust EVM Testnet",
  "nativeCurrency": {
    "name": "Trust EVM",
    "symbol": "EVM",
    "decimals": 18
  },
  "networkId": 15555,
  "rpc": [
    "https://trust-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://15555.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.testnet-dev.trust.one"
  ],
  "shortName": "TrustTestnet",
  "slug": "trust-evm-testnet",
  "testnet": true
} as const satisfies Chain;