import type { Chain } from "../src/types";
export default {
  "chainId": 21,
  "chain": "ETH",
  "name": "Elastos Smart Chain Testnet",
  "rpc": [
    "https://elastos-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api-testnet.elastos.io/eth"
  ],
  "slug": "elastos-smart-chain-testnet",
  "faucets": [
    "https://esc-faucet.elastos.io/"
  ],
  "nativeCurrency": {
    "name": "Elastos",
    "symbol": "tELA",
    "decimals": 18
  },
  "infoURL": "https://www.elastos.org/",
  "shortName": "esct",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "elastos esc explorer",
      "url": "https://esc-testnet.elastos.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;