import type { Chain } from "../src/types";
export default {
  "name": "JuncaChain testnet",
  "chain": "JuncaChain testnet",
  "rpc": [
    "https://juncachain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.juncachain.com",
    "wss://ws-testnet.juncachain.com"
  ],
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
  "chainId": 669,
  "networkId": 669,
  "explorers": [
    {
      "name": "JuncaScan",
      "url": "https://scan-testnet.juncachain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "juncachain-testnet"
} as const satisfies Chain;