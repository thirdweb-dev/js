import type { Chain } from "../src/types";
export default {
  "chainId": 444900,
  "chain": "WLK",
  "name": "Weelink Testnet",
  "rpc": [
    "https://weelink-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://weelinknode1c.gw002.oneitfarm.com"
  ],
  "slug": "weelink-testnet",
  "faucets": [
    "https://faucet.weelink.gw002.oneitfarm.com"
  ],
  "nativeCurrency": {
    "name": "Weelink Chain Token",
    "symbol": "tWLK",
    "decimals": 18
  },
  "infoURL": "https://weelink.cloud",
  "shortName": "wlkt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "weelink-testnet",
      "url": "https://weelink.cloud/#/blockView/overview",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;