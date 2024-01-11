import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 5001,
  "explorers": [
    {
      "name": "Mantle Testnet Explorer",
      "url": "https://explorer.testnet.mantle.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.testnet.mantle.xyz"
  ],
  "infoURL": "https://mantle.xyz",
  "name": "Mantle Testnet",
  "nativeCurrency": {
    "name": "Testnet Mantle",
    "symbol": "MNT",
    "decimals": 18
  },
  "networkId": 5001,
  "rpc": [
    "https://mantle-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.mantle.xyz"
  ],
  "shortName": "mantle-testnet",
  "slip44": 1,
  "slug": "mantle-testnet",
  "testnet": true
} as const satisfies Chain;