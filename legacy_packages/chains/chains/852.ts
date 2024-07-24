import type { Chain } from "../src/types";
export default {
  "chain": "HONGKONG",
  "chainId": 852,
  "explorers": [
    {
      "name": "HongKong Mainnet Explorer",
      "url": "http://47.238.205.52",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.cmi.chinamobile.com/",
  "name": "HongKong Mainnet",
  "nativeCurrency": {
    "name": "HongKong",
    "symbol": "HK",
    "decimals": 18
  },
  "networkId": 852,
  "rpc": [
    "https://852.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth.jegotrip.net"
  ],
  "shortName": "HongKong",
  "slug": "hongkong",
  "testnet": false
} as const satisfies Chain;