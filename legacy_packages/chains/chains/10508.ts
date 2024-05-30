import type { Chain } from "../src/types";
export default {
  "chain": "NUM",
  "chainId": 10508,
  "explorers": [
    {
      "name": "ethernal",
      "url": "https://testnet.num.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.avax.network/?subnet=num",
    "https://faucet.num.network"
  ],
  "infoURL": "https://numbersprotocol.io",
  "name": "Numbers Testnet",
  "nativeCurrency": {
    "name": "NUM Token",
    "symbol": "NUM",
    "decimals": 18
  },
  "networkId": 10508,
  "rpc": [
    "https://10508.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnetrpc.num.network"
  ],
  "shortName": "Snow",
  "slip44": 1,
  "slug": "numbers-testnet",
  "testnet": true
} as const satisfies Chain;