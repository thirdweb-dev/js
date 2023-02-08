export default {
  "name": "Weelink Testnet",
  "chain": "WLK",
  "rpc": [
    "https://weelinknode1c.gw002.oneitfarm.com"
  ],
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
  "chainId": 444900,
  "networkId": 444900,
  "explorers": [
    {
      "name": "weelink-testnet",
      "url": "https://weelink.cloud/#/blockView/overview",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "weelink-testnet"
} as const;