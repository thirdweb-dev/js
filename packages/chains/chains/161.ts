import type { Chain } from "../src/types";
export default {
  "chain": "Wall-e",
  "chainId": 161,
  "explorers": [
    {
      "name": "blockscout - evascan",
      "url": "https://testnet.evascan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://amax.network",
  "name": "Armonia Eva Chain Testnet",
  "nativeCurrency": {
    "name": "Armonia Multichain Native Token",
    "symbol": "AMAX",
    "decimals": 18
  },
  "networkId": 161,
  "rpc": [
    "https://armonia-eva-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://161.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.evascan.io/api/eth-rpc/"
  ],
  "shortName": "wall-e",
  "slug": "armonia-eva-chain-testnet",
  "testnet": true
} as const satisfies Chain;