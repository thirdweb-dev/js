import type { Chain } from "../src/types";
export default {
  "name": "Ethereum Classic Mainnet",
  "chain": "ETC",
  "rpc": [
    "https://ethereum-classic.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://etc.rivet.link",
    "https://etc.etcdesktop.com",
    "https://etc.mytokenpocket.vip"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ethereum Classic Ether",
    "symbol": "ETC",
    "decimals": 18
  },
  "infoURL": "https://ethereumclassic.org",
  "shortName": "etc",
  "chainId": 61,
  "networkId": 1,
  "slip44": 61,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/etc/mainnet",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "ethereum-classic"
} as const satisfies Chain;