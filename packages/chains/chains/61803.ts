export default {
  "name": "Etica Mainnet",
  "chain": "Etica Protocol (ETI/EGAZ)",
  "icon": {
    "url": "ipfs://QmYSyhUqm6ArWyALBe3G64823ZpEUmFdkzKZ93hUUhNKgU",
    "width": 360,
    "height": 361,
    "format": "png"
  },
  "rpc": [
    "https://etica.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eticamainnet.eticascan.org",
    "https://eticamainnet.eticaprotocol.org"
  ],
  "faucets": [
    "http://faucet.etica-stats.org/"
  ],
  "nativeCurrency": {
    "name": "EGAZ",
    "symbol": "EGAZ",
    "decimals": 18
  },
  "infoURL": "https://eticaprotocol.org",
  "shortName": "Etica",
  "chainId": 61803,
  "networkId": 61803,
  "explorers": [
    {
      "name": "eticascan",
      "url": "https://eticascan.org",
      "standard": "EIP3091"
    },
    {
      "name": "eticastats",
      "url": "http://explorer.etica-stats.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "etica"
} as const;