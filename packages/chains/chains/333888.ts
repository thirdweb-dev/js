export default {
  "name": "Polis Testnet",
  "chain": "Sparta",
  "icon": {
    "url": "ipfs://QmagWrtyApex28H2QeXcs3jJ2F7p2K7eESz3cDbHdQ3pjG",
    "width": 1050,
    "height": 1050,
    "format": "png"
  },
  "rpc": [
    "https://polis-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sparta-rpc.polis.tech"
  ],
  "faucets": [
    "https://faucet.polis.tech"
  ],
  "nativeCurrency": {
    "name": "tPolis",
    "symbol": "tPOLIS",
    "decimals": 18
  },
  "infoURL": "https://polis.tech",
  "shortName": "sparta",
  "chainId": 333888,
  "networkId": 333888,
  "testnet": true,
  "slug": "polis-testnet"
} as const;