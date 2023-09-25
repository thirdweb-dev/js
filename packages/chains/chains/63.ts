import type { Chain } from "../src/types";
export default {
  "chainId": 63,
  "chain": "ETC",
  "name": "Ethereum Classic Testnet Mordor",
  "rpc": [
    "https://ethereum-classic-testnet-mordor.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mordor.etccooperative.org"
  ],
  "slug": "ethereum-classic-testnet-mordor",
  "faucets": [
    "https://mordor.canhaz.net/",
    "https://easy.hebeswap.com/#/faucet"
  ],
  "nativeCurrency": {
    "name": "Mordor Classic Testnet Ether",
    "symbol": "METC",
    "decimals": 18
  },
  "infoURL": "https://github.com/eth-classic/mordor/",
  "shortName": "metc",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/etc/mordor",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ]
} as const satisfies Chain;