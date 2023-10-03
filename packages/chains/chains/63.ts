import type { Chain } from "../src/types";
export default {
  "chain": "ETC",
  "chainId": 63,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/etc/mordor",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://mordor.canhaz.net/",
    "https://easy.hebeswap.com/#/faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://github.com/eth-classic/mordor/",
  "name": "Ethereum Classic Testnet Mordor",
  "nativeCurrency": {
    "name": "Mordor Classic Testnet Ether",
    "symbol": "METC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ethereum-classic-testnet-mordor.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mordor.etccooperative.org"
  ],
  "shortName": "metc",
  "slug": "ethereum-classic-testnet-mordor",
  "testnet": true
} as const satisfies Chain;