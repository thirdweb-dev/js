import type { Chain } from "../types";
export default {
  "chain": "Canto Tesnet",
  "chainId": 740,
  "explorers": [
    {
      "name": "Canto Tesnet Explorer (Neobase)",
      "url": "https://testnet-explorer.canto.neobase.one",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://canto.io",
  "name": "Canto Testnet",
  "nativeCurrency": {
    "name": "Canto",
    "symbol": "CANTO",
    "decimals": 18
  },
  "networkId": 740,
  "rpc": [
    "https://canto-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://740.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth.plexnode.wtf/"
  ],
  "shortName": "tcanto",
  "slug": "canto-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;