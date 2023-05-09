import type { Chain } from "../src/types";
export default {
  "name": "LA Testnet",
  "chain": "LATestnet",
  "rpc": [
    "https://la-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.lachain.network"
  ],
  "faucets": [
    "https://faucet.lachain.network"
  ],
  "nativeCurrency": {
    "name": "Test La Coin",
    "symbol": "TLA",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "",
  "shortName": "latestnet",
  "chainId": 418,
  "networkId": 418,
  "explorers": [
    {
      "name": "LA Testnet Explorer",
      "url": "https://testexplorer.lachain.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "la-testnet"
} as const satisfies Chain;