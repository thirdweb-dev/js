import type { Chain } from "../types";
export default {
  "chain": "OYchain",
  "chainId": 125,
  "explorers": [
    {
      "name": "OYchain Testnet Explorer",
      "url": "https://explorer.testnet.oychain.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.oychain.io"
  ],
  "infoURL": "https://www.oychain.io",
  "name": "OYchain Testnet",
  "nativeCurrency": {
    "name": "OYchain Token",
    "symbol": "OY",
    "decimals": 18
  },
  "networkId": 125,
  "rpc": [
    "https://oychain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://125.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.oychain.io"
  ],
  "shortName": "OYchainTestnet",
  "slip44": 125,
  "slug": "oychain-testnet",
  "testnet": true
} as const satisfies Chain;