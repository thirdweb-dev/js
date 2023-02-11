export default {
  "name": "Flachain Mainnet",
  "chain": "FLX",
  "icon": {
    "url": "ipfs://bafybeiadlvc4pfiykehyt2z67nvgt5w4vlov27olu5obvmryv4xzua4tae",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "rpc": [
    "https://flachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://flachain.flaexchange.top/"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Flacoin",
    "symbol": "FLA",
    "decimals": 18
  },
  "infoURL": "https://www.flaexchange.top",
  "shortName": "fla",
  "chainId": 29032022,
  "networkId": 29032022,
  "explorers": [
    {
      "name": "FLXExplorer",
      "url": "https://explorer.flaexchange.top",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "flachain"
} as const;