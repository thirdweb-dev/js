import type { Chain } from "../src/types";
export default {
  "chainId": 170,
  "chain": "ETH",
  "name": "HOO Smart Chain Testnet",
  "rpc": [
    "https://hoo-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-testnet.hoosmartchain.com"
  ],
  "slug": "hoo-smart-chain-testnet",
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
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;