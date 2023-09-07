import type { Chain } from "../src/types";
export default {
  "name": "Ethereum Classic Testnet Mordor",
  "chain": "ETC",
  "rpc": [
    "https://ethereum-classic-testnet-mordor.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mordor.etccooperative.org"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
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
  "chainId": 63,
  "networkId": 7,
  "slip44": 63,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/etc/mordor",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "ethereum-classic-testnet-mordor"
} as const satisfies Chain;