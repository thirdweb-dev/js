export default {
  "name": "OHO Mainnet",
  "chain": "OHO",
  "rpc": [
    "https://oho.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.oho.ai"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OHO",
    "symbol": "OHO",
    "decimals": 18
  },
  "infoURL": "https://oho.ai",
  "shortName": "oho",
  "chainId": 39815,
  "networkId": 39815,
  "icon": {
    "url": "ipfs://QmZt75xixnEtFzqHTrJa8kJkV4cTXmUZqeMeHM8BcvomQc",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "ohoscan",
      "url": "https://ohoscan.com",
      "icon": "ohoscan",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "oho"
} as const;