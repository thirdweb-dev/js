export default {
  "name": "Europa SKALE Chain",
  "chain": "europa",
  "icon": {
    "url": "ipfs://bafkreiezcwowhm6xjrkt44cmiu6ml36rhrxx3amcg3cfkcntv2vgcvgbre",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "rpc": [
    "https://europa-skale-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/elated-tan-skat",
    "wss://mainnet.skalenodes.com/v1/elated-tan-skat"
  ],
  "faucets": [
    "https://ruby.exchange/faucet.html",
    "https://sfuel.mylilius.com/"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://europahub.network/",
  "shortName": "europa",
  "chainId": 2046399126,
  "networkId": 2046399126,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://elated-tan-skat.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://ruby.exchange/bridge.html"
      }
    ]
  },
  "testnet": false,
  "slug": "europa-skale-chain"
} as const;