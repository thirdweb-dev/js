import type { Chain } from "../src/types";
export default {
  "chainId": 15555,
  "chain": "Trust EVM Testnet",
  "name": "Trust EVM Testnet",
  "rpc": [
    "https://trust-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.testnet-dev.trust.one"
  ],
  "slug": "trust-evm-testnet",
  "faucets": [
    "https://faucet.testnet-dev.trust.one/"
  ],
  "nativeCurrency": {
    "name": "Trust EVM",
    "symbol": "EVM",
    "decimals": 18
  },
  "infoURL": "https://www.trust.one/",
  "shortName": "TrustTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Trust EVM Explorer",
      "url": "https://trustscan.one",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;