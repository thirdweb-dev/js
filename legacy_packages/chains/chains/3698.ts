import type { Chain } from "../src/types";
export default {
  "chain": "SPC",
  "chainId": 3698,
  "explorers": [
    {
      "name": "SenjePowers",
      "url": "https://testnet.senjepowersscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.senjepowersscan.com"
  ],
  "infoURL": "https://senjepowersscan.com",
  "name": "SenjePowers Testnet",
  "nativeCurrency": {
    "name": "SenjePowers",
    "symbol": "SPC",
    "decimals": 18
  },
  "networkId": 3698,
  "rpc": [
    "https://3698.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.senjepowersscan.com"
  ],
  "shortName": "SPCt",
  "slip44": 1,
  "slug": "senjepowers-testnet",
  "testnet": true
} as const satisfies Chain;