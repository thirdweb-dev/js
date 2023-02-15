export default {
  "name": "Venidium Mainnet",
  "chain": "XVM",
  "icon": {
    "url": "ipfs://bafkreiaplwlym5g27jm4mjhotfqq6al2cxp3fnkmzdusqjg7wnipq5wn2e",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "rpc": [
    "https://venidium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.venidium.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Venidium",
    "symbol": "XVM",
    "decimals": 18
  },
  "infoURL": "https://venidium.io",
  "shortName": "xvm",
  "chainId": 4919,
  "networkId": 4919,
  "explorers": [
    {
      "name": "Venidium Explorer",
      "url": "https://evm.venidiumexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "venidium"
} as const;