import type { Chain } from "../src/types";
export default {
  "chain": "WLK",
  "chainId": 444900,
  "explorers": [
    {
      "name": "weelink-testnet",
      "url": "https://weelink.cloud/#/blockView/overview",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.weelink.gw002.oneitfarm.com"
  ],
  "infoURL": "https://weelink.cloud",
  "name": "Weelink Testnet",
  "nativeCurrency": {
    "name": "Weelink Chain Token",
    "symbol": "tWLK",
    "decimals": 18
  },
  "networkId": 444900,
  "rpc": [
    "https://weelink-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://444900.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://weelinknode1c.gw002.oneitfarm.com"
  ],
  "shortName": "wlkt",
  "slip44": 1,
  "slug": "weelink-testnet",
  "testnet": true
} as const satisfies Chain;