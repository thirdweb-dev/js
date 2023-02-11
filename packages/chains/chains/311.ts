export default {
  "name": "Omax Mainnet",
  "chain": "OMAX Chain",
  "rpc": [
    "https://omax.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainapi.omaxray.com"
  ],
  "faucets": [
    "https://faucet.omaxray.com/"
  ],
  "nativeCurrency": {
    "name": "OMAX COIN",
    "symbol": "OMAX",
    "decimals": 18
  },
  "infoURL": "https://www.omaxcoin.com/",
  "shortName": "omax",
  "chainId": 311,
  "networkId": 311,
  "icon": {
    "url": "ipfs://Qmd7omPxrehSuxHHPMYd5Nr7nfrtjKdRJQEhDLfTb87w8G",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Omax Chain Explorer",
      "url": "https://omaxray.com",
      "icon": "omaxray",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "omax"
} as const;