export default {
  "name": "Autonity Bakerloo (Thames) Testnet",
  "chain": "AUT",
  "rpc": [
    "https://autonity-bakerloo-thames-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.bakerloo.autonity.org/",
    "wss://rpc1.bakerloo.autonity.org/ws/"
  ],
  "faucets": [
    "https://faucet.autonity.org/"
  ],
  "nativeCurrency": {
    "name": "Bakerloo Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "infoURL": "https://autonity.org/",
  "shortName": "bakerloo-0",
  "chainId": 65010000,
  "networkId": 65010000,
  "explorers": [
    {
      "name": "autonity-blockscout",
      "url": "https://bakerloo.autonity.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "autonity-bakerloo-thames-testnet"
} as const;