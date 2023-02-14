export default {
  "name": "Blockchain Genesis Mainnet",
  "chain": "GEN",
  "rpc": [
    "https://blockchain-genesis.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eu.mainnet.xixoio.com",
    "https://us.mainnet.xixoio.com",
    "https://asia.mainnet.xixoio.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GEN",
    "symbol": "GEN",
    "decimals": 18
  },
  "infoURL": "https://www.xixoio.com/",
  "shortName": "GEN",
  "chainId": 10101,
  "networkId": 10101,
  "testnet": false,
  "slug": "blockchain-genesis"
} as const;