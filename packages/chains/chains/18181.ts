import type { Chain } from "../src/types";
export default {
  "chain": "G8C",
  "chainId": 18181,
  "explorers": [
    {
      "name": "G8Chain",
      "url": "https://testnet.oneg8.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.oneg8.network"
  ],
  "icon": {
    "url": "ipfs://QmbkCVC5vZpVAfq8SuPXR9PhpTRS2m8w6LGqBkhXAvmie6",
    "width": 80,
    "height": 80,
    "format": "png"
  },
  "infoURL": "https://oneg8.one",
  "name": "G8Chain Testnet",
  "nativeCurrency": {
    "name": "G8Coin",
    "symbol": "G8C",
    "decimals": 18
  },
  "networkId": 18181,
  "rpc": [
    "https://g8chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://18181.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.oneg8.network"
  ],
  "shortName": "G8Ct",
  "slip44": 1,
  "slug": "g8chain-testnet",
  "testnet": true
} as const satisfies Chain;