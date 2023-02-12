export default {
  "name": "Kiln",
  "chain": "ETH",
  "rpc": [
    "https://kiln.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kiln.themerge.dev"
  ],
  "faucets": [
    "https://faucet.kiln.themerge.dev",
    "https://kiln-faucet.pk910.de",
    "https://kilnfaucet.com"
  ],
  "nativeCurrency": {
    "name": "Testnet ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://kiln.themerge.dev/",
  "shortName": "kiln",
  "chainId": 1337802,
  "networkId": 1337802,
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Kiln Explorer",
      "url": "https://explorer.kiln.themerge.dev",
      "icon": "ethereum",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "kiln"
} as const;