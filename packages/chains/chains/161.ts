import type { Chain } from "../src/types";
export default {
  "chainId": 161,
  "chain": "Wall-e",
  "name": "Armonia Eva Chain Testnet",
  "rpc": [
    "https://armonia-eva-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.evascan.io/api/eth-rpc/"
  ],
  "slug": "armonia-eva-chain-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Armonia Multichain Native Token",
    "symbol": "AMAX",
    "decimals": 18
  },
  "infoURL": "https://amax.network",
  "shortName": "wall-e",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout - evascan",
      "url": "https://testnet.evascan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;