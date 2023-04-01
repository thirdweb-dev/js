import type { Chain } from "../src/types";
export default {
  "name": "Kovan",
  "title": "Ethereum Testnet Kovan",
  "chain": "ETH",
  "rpc": [],
  "faucets": [
    "http://fauceth.komputing.org?chain=42&address=${ADDRESS}",
    "https://faucet.kovan.network",
    "https://gitter.im/kovan-testnet/faucet"
  ],
  "nativeCurrency": {
    "name": "Kovan Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "explorers": [
    {
      "name": "etherscan",
      "url": "https://kovan.etherscan.io",
      "standard": "EIP3091"
    }
  ],
  "infoURL": "https://kovan-testnet.github.io/website",
  "shortName": "kov",
  "chainId": 42,
  "networkId": 42,
  "testnet": true,
  "slug": "kovan"
} as const satisfies Chain;