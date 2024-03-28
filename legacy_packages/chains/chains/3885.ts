import type { Chain } from "../src/types";
export default {
  "chain": "Firechain",
  "chainId": 3885,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://docs.thefirechain.com/",
  "name": "Firechain zkEVM Ghostrider",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 3885,
  "rpc": [
    "https://3885.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-zkevm-ghostrider.thefirechain.com"
  ],
  "shortName": "firechain-zkEVM-testnet",
  "slug": "firechain-zkevm-ghostrider",
  "testnet": true,
  "title": "Firechain zkEVM Testnet"
} as const satisfies Chain;