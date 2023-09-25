import type { Chain } from "../src/types";
export default {
  "chainId": 5001,
  "chain": "ETH",
  "name": "Mantle Testnet",
  "rpc": [
    "https://mantle-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.mantle.xyz"
  ],
  "slug": "mantle-testnet",
  "faucets": [
    "https://faucet.testnet.mantle.xyz"
  ],
  "nativeCurrency": {
    "name": "Testnet Mantle",
    "symbol": "MNT",
    "decimals": 18
  },
  "infoURL": "https://mantle.xyz",
  "shortName": "mantle-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Mantle Testnet Explorer",
      "url": "https://explorer.testnet.mantle.xyz",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;