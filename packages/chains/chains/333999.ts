export default {
  "name": "Polis Mainnet",
  "chain": "Olympus",
  "icon": {
    "url": "ipfs://QmagWrtyApex28H2QeXcs3jJ2F7p2K7eESz3cDbHdQ3pjG",
    "width": 1050,
    "height": 1050,
    "format": "png"
  },
  "rpc": [
    "https://polis.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.polis.tech"
  ],
  "faucets": [
    "https://faucet.polis.tech"
  ],
  "nativeCurrency": {
    "name": "Polis",
    "symbol": "POLIS",
    "decimals": 18
  },
  "infoURL": "https://polis.tech",
  "shortName": "olympus",
  "chainId": 333999,
  "networkId": 333999,
  "testnet": false,
  "slug": "polis"
} as const;