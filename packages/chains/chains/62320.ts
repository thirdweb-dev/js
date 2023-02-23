export default {
  "name": "Celo Baklava Testnet",
  "chainId": 62320,
  "shortName": "BKLV",
  "chain": "CELO",
  "networkId": 62320,
  "nativeCurrency": {
    "name": "CELO",
    "symbol": "CELO",
    "decimals": 18
  },
  "rpc": [
    "https://celo-baklava-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://baklava-forno.celo-testnet.org"
  ],
  "faucets": [
    "https://docs.google.com/forms/d/e/1FAIpQLSdfr1BwUTYepVmmvfVUDRCwALejZ-TUva2YujNpvrEmPAX2pg/viewform",
    "https://cauldron.pretoriaresearchlab.io/baklava-faucet"
  ],
  "infoURL": "https://docs.celo.org/",
  "testnet": true,
  "slug": "celo-baklava-testnet"
} as const;