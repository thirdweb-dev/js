import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 21,
  "explorers": [
    {
      "name": "elastos esc explorer",
      "url": "https://esc-testnet.elastos.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://esc-faucet.elastos.io/"
  ],
  "features": [],
  "infoURL": "https://www.elastos.org/",
  "name": "Elastos Smart Chain Testnet",
  "nativeCurrency": {
    "name": "Elastos",
    "symbol": "ELA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://elastos-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api-testnet.elastos.io/eth"
  ],
  "shortName": "esct",
  "slug": "elastos-smart-chain-testnet",
  "testnet": true
} as const satisfies Chain;