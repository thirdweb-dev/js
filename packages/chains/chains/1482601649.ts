export default {
  "name": "Nebula Mainnet",
  "chain": "green-giddy-denebola",
  "rpc": [
    "https://nebula.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/green-giddy-denebola",
    "wss://mainnet-proxy.skalenodes.com/v1/ws/green-giddy-denebola"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://nebulachain.io/",
  "shortName": "nebula-mainnet",
  "chainId": 1482601649,
  "networkId": 1482601649,
  "explorers": [
    {
      "name": "nebula",
      "url": "https://green-giddy-denebola.explorer.mainnet.skalenodes.com",
      "icon": "nebula",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "nebula"
} as const;