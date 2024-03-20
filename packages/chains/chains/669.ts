import type { Chain } from "../src/types";
export default {
  "chain": "JuncaChain testnet",
  "chainId": 669,
  "explorers": [
    {
      "name": "JuncaScan",
      "url": "https://scan-testnet.juncachain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet-testnet.juncachain.com"
  ],
  "infoURL": "https://junca-cash.world",
  "name": "JuncaChain testnet",
  "nativeCurrency": {
    "name": "JuncaChain Testnet Native Token",
    "symbol": "JGCT",
    "decimals": 18
  },
  "networkId": 669,
  "rpc": [
    "https://669.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.juncachain.com",
    "wss://ws-testnet.juncachain.com"
  ],
  "shortName": "juncat",
  "slip44": 1,
  "slug": "juncachain-testnet",
  "testnet": true
} as const satisfies Chain;