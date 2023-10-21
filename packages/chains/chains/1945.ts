import type { Chain } from "../src/types";
export default {
  "chain": "onus",
  "chainId": 1945,
  "explorers": [
    {
      "name": "Onus explorer testnet",
      "url": "https://explorer-testnet.onuschain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://onuschain.io",
  "name": "ONUS Chain Testnet",
  "nativeCurrency": {
    "name": "ONUS",
    "symbol": "ONUS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://onus-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.onuschain.io"
  ],
  "shortName": "onus-testnet",
  "slug": "onus-chain-testnet",
  "testnet": true
} as const satisfies Chain;