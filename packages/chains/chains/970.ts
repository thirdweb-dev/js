export default {
  "name": "Oort Mainnet",
  "chain": "Oort Mainnet",
  "rpc": [
    "https://oort.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.oortech.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Oort",
    "symbol": "CCN",
    "decimals": 18
  },
  "infoURL": "https://oortech.com",
  "shortName": "ccn",
  "chainId": 970,
  "networkId": 970,
  "icon": {
    "url": "ipfs://QmZ1jbxFZcuotj3eZ6iKFrg9ZXnaV8AK6sGRa7ELrceWyD",
    "width": 1043,
    "height": 1079,
    "format": "png"
  },
  "testnet": false,
  "slug": "oort"
} as const;