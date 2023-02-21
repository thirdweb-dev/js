export default {
  "name": "Celo Alfajores Testnet",
  "chainId": 44787,
  "shortName": "ALFA",
  "chain": "CELO",
  "networkId": 44787,
  "nativeCurrency": {
    "name": "CELO",
    "symbol": "CELO",
    "decimals": 18
  },
  "rpc": [
    "https://celo-alfajores-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://alfajores-forno.celo-testnet.org",
    "wss://alfajores-forno.celo-testnet.org/ws"
  ],
  "faucets": [
    "https://celo.org/developers/faucet",
    "https://cauldron.pretoriaresearchlab.io/alfajores-faucet"
  ],
  "infoURL": "https://docs.celo.org/",
  "explorers": [
    {
      "name": "Celoscan",
      "url": "https://celoscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "celo-alfajores-testnet"
} as const;