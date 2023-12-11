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
    "https://firechain-zkevm-ghostrider.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3885.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.zkevm.ghostrider.thefirechain.com"
  ],
  "shortName": "firechain-zkEVM-ghostrider",
  "slug": "firechain-zkevm-ghostrider",
  "testnet": false,
  "title": "Firechain zkEVM Ghostrider"
} as const satisfies Chain;