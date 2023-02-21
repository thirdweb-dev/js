export default {
  "name": "Ethereum Classic Testnet Kotti",
  "chain": "ETC",
  "rpc": [
    "https://ethereum-classic-testnet-kotti.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.ethercluster.com/kotti"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Kotti Ether",
    "symbol": "KOT",
    "decimals": 18
  },
  "infoURL": "https://explorer.jade.builders/?network=kotti",
  "shortName": "kot",
  "chainId": 6,
  "networkId": 6,
  "testnet": true,
  "slug": "ethereum-classic-testnet-kotti"
} as const;