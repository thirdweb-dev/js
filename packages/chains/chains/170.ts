import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 170,
  "explorers": [],
  "faucets": [
    "https://faucet-testnet.hscscan.com/"
  ],
  "infoURL": "https://www.hoosmartchain.com",
  "name": "HOO Smart Chain Testnet",
  "nativeCurrency": {
    "name": "HOO",
    "symbol": "HOO",
    "decimals": 18
  },
  "networkId": 170,
  "rpc": [
    "https://170.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-testnet.hoosmartchain.com"
  ],
  "shortName": "hoosmartchain",
  "slip44": 1,
  "slug": "hoo-smart-chain-testnet",
  "testnet": true
} as const satisfies Chain;