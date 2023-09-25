import type { Chain } from "../src/types";
export default {
  "chainId": 1945,
  "chain": "onus",
  "name": "ONUS Chain Testnet",
  "rpc": [
    "https://onus-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.onuschain.io"
  ],
  "slug": "onus-chain-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "ONUS",
    "symbol": "ONUS",
    "decimals": 18
  },
  "infoURL": "https://onuschain.io",
  "shortName": "onus-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Onus explorer testnet",
      "url": "https://explorer-testnet.onuschain.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;