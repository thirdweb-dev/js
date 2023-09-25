import type { Chain } from "../src/types";
export default {
  "chainId": 61,
  "chain": "ETC",
  "name": "Ethereum Classic Mainnet",
  "rpc": [
    "https://ethereum-classic.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://etc.rivet.link",
    "https://etc.etcdesktop.com",
    "https://etc.mytokenpocket.vip"
  ],
  "slug": "ethereum-classic",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ethereum Classic Ether",
    "symbol": "ETC",
    "decimals": 18
  },
  "infoURL": "https://ethereumclassic.org",
  "shortName": "etc",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/etc/mainnet",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ]
} as const satisfies Chain;