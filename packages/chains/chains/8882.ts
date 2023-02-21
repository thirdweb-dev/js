export default {
  "name": "Opal testnet by Unique",
  "icon": {
    "url": "ipfs://QmYJDpmWyjDa3H6BxweFmQXk4fU8b1GU7M9EqYcaUNvXzc",
    "width": 48,
    "height": 48,
    "format": "svg"
  },
  "chain": "UNQ",
  "rpc": [
    "https://opal-testnet-by-unique.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-opal.unique.network",
    "https://us-rpc-opal.unique.network",
    "https://eu-rpc-opal.unique.network",
    "https://asia-rpc-opal.unique.network"
  ],
  "faucets": [
    "https://t.me/unique2faucet_opal_bot"
  ],
  "nativeCurrency": {
    "name": "Opal",
    "symbol": "UNQ",
    "decimals": 18
  },
  "infoURL": "https://unique.network",
  "shortName": "opl",
  "chainId": 8882,
  "networkId": 8882,
  "explorers": [
    {
      "name": "Unique Scan / Opal",
      "url": "https://uniquescan.io/opal",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "opal-testnet-by-unique"
} as const;