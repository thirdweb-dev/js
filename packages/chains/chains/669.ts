import type { Chain } from "../src/types";
export default {
  "chainId": 669,
  "chain": "JuncaChain testnet",
  "name": "JuncaChain testnet",
  "rpc": [
    "https://juncachain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.juncachain.com",
    "wss://ws-testnet.juncachain.com"
  ],
  "slug": "juncachain-testnet",
  "faucets": [
    "https://faucet-testnet.juncachain.com"
  ],
  "nativeCurrency": {
    "name": "JuncaChain Testnet Native Token",
    "symbol": "JGCT",
    "decimals": 18
  },
  "infoURL": "https://junca-cash.world",
  "shortName": "juncat",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "JuncaScan",
      "url": "https://scan-testnet.juncachain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;