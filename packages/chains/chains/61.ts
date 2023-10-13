import type { Chain } from "../src/types";
export default {
  "chain": "ETC",
  "chainId": 61,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/etc/mainnet",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://ethereumclassic.org",
  "name": "Ethereum Classic Mainnet",
  "nativeCurrency": {
    "name": "Ethereum Classic Ether",
    "symbol": "ETC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ethereum-classic.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://etc.rivet.link",
    "https://etc.etcdesktop.com",
    "https://etc.mytokenpocket.vip"
  ],
  "shortName": "etc",
  "slug": "ethereum-classic",
  "testnet": false
} as const satisfies Chain;