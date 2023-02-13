export default {
  "name": "Dogechain Mainnet",
  "chain": "DC",
  "icon": {
    "url": "ipfs://QmNS6B6L8FfgGSMTEi2SxD3bK5cdmKPNtQKcYaJeRWrkHs",
    "width": 732,
    "height": 732,
    "format": "png"
  },
  "rpc": [
    "https://dogechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dogechain.dog",
    "https://rpc-us.dogechain.dog",
    "https://rpc01.dogechain.dog"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dogecoin",
    "symbol": "DOGE",
    "decimals": 18
  },
  "infoURL": "https://dogechain.dog",
  "shortName": "dc",
  "chainId": 2000,
  "networkId": 2000,
  "explorers": [
    {
      "name": "dogechain explorer",
      "url": "https://explorer.dogechain.dog",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "dogechain"
} as const;