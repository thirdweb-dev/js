import type { Chain } from "../src/types";
export default {
  "chain": "NOVA chain",
  "chainId": 56789,
  "explorers": [
    {
      "name": "novascan",
      "url": "https://novascan.velo.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://nova-faucet.velo.org"
  ],
  "infoURL": "https://velo.org",
  "name": "VELO Labs Mainnet",
  "nativeCurrency": {
    "name": "Nova",
    "symbol": "NOVA",
    "decimals": 18
  },
  "networkId": 56789,
  "rpc": [
    "https://56789.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nova.velo.org"
  ],
  "shortName": "VELO",
  "slug": "velo-labs",
  "testnet": false
} as const satisfies Chain;