import type { Chain } from "../src/types";
export default {
  "name": "HOO Smart Chain Testnet",
  "chain": "ETH",
  "rpc": [],
  "faucets": [
    "https://faucet-testnet.hscscan.com/"
  ],
  "nativeCurrency": {
    "name": "HOO",
    "symbol": "HOO",
    "decimals": 18
  },
  "infoURL": "https://www.hoosmartchain.com",
  "shortName": "hoosmartchain",
  "chainId": 170,
  "networkId": 170,
  "testnet": true,
  "slug": "hoo-smart-chain-testnet"
} as const satisfies Chain;